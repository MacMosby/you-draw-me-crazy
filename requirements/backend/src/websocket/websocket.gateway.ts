import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConnectionRegistry } from './websocket.service';
import type { DrawPayload, GuessPayload, JoinRoomPayload, StrokeAppendPayload, TurnInfoPayload } from './dtos/ws.payloads';
import { WS_EVENTS } from './dtos/ws.events';
import { RoomsService } from 'src/rooms/rooms.service';
import { GameService } from 'src/game/game.service';
import { TurnEmitService } from './turnemit.service';

@WebSocketGateway()
export class WebsocketGateway {
	//more flexible emit
	@WebSocketServer()
	server: Server;

	constructor( 
		private readonly registry: ConnectionRegistry,
		private readonly roomService: RoomsService,
		private readonly gameService: GameService,
		private readonly turnemitservice: TurnEmitService,
	) {}
	afterInit() { console.log('WebSocket Gateway initialized') }

	//Lifecycle hooks
	handleConnection(client: Socket) {
		console.log('Client connected: ', client.id);
		client.emit('pleaseIdentify');
		//after timeout (in ms) is up, check if condition is met)
		const timer = setTimeout(() => {
			if (!client.data.userId) {
				console.log('Identify timeout missed by client with id: ', client.id)
				client.disconnect(true);
			}
		}, 5000);
		client.data.identifyTimer = timer;
	}

	handleDisconnect(client: Socket) {
		//automatically removes socket from socket.io rooms
		const userId = client.data.userId;
		if (!userId) return;

		const roomId = client.data.roomId;
    	const room = this.roomService.getRoom(roomId);

		// if the disconnect === drawer: end turn)
		if (room && room.drawer === userId && room.state === 'playing') {
			if (room.timeout) {
				clearTimeout(room.timeout);
				room.timeout = undefined;
			}
			console.log('Drawing player disconnected: turn ended');
		    this.gameService.endOfTurn(room, this.server);
		}
		this.roomService.removeUser(userId);
		this.registry.removeConnection(userId, client);
		console.log(`Client ${client.id} with user id ${client.data.userId} disconnected`);
	}

	//events from here on downwards
	@SubscribeMessage('identify')
	async handleIdentify(
		@MessageBody() data: { userId: number },
		@ConnectedSocket() socket: Socket,
	) {
		socket.data.userId = data.userId;
		clearTimeout(socket.data.identifyTimer);
		this.registry.addConnection(data.userId, socket);
		console.log(`Socket ${socket.id} identified as user ${data.userId}`);
		socket.emit('identified');
		this.registry.printRegistry();
		await socket.join(`user-${data.userId}`);
	}
	
	@SubscribeMessage('whoAmI')
	handleWhoAmI(
		@MessageBody() data: any,//call with empty data {}
		@ConnectedSocket() client: Socket,
	) {
		console.log('Received whoAmI from', client.data.userId, 'with data: ', data);
		client.emit('youAre', {
			userId: client.data.userId ?? null,
		});
	}

	@SubscribeMessage(WS_EVENTS.JOIN_ROOM) 
	async handleJoinRoom(
		@ConnectedSocket() client: Socket,
		@MessageBody() payload: JoinRoomPayload,
	) {
		console.log('[recv] JoinRoom', payload);

		// add user to available room in the backend
		const room = await this.roomService.findAvailableRoom(payload.user_id);

		try {
			if (room.state === 'lobby' && room.players.length < room.maxPlayers)
				await this.roomService.addUser(payload.user_id, room.id, 'player')
			else if (room.state == 'playing')
				await this.roomService.addUser(payload.user_id, room.id, 'spectator');
		} catch (e) {
			console.log(`[JoinRoom] ${e.message}`); 
		}

		if (room.id === -1) {
			client.emit(WS_EVENTS.ROOM_FULL);
			return;
		}
		// add user to the socket.io room
		const socketRoom = `room-${room.id}`;
		await client.join(socketRoom);
		client.data.roomId = room.id;

		// build and emit payload for every player & spectator individually.
		this.turnemitservice.emitTurnInfo(room, this.server);

		// emit drawing state to everybody
		this.emitFullDrawingState(room.id, client);
		if (room.players.length === 3 && room.state === 'lobby') {
			this.gameService.startTurn(room, this.server);
		} 
	}
	
	@SubscribeMessage(WS_EVENTS.GUESS)
	handleGuess(
		@ConnectedSocket() client: Socket,
		@MessageBody() payload: GuessPayload,
	) {
		console.log('[recv] Guess', payload);
		const socketRoom = `room-${payload.room_id}`;
		const room = this.roomService.getRoom(payload.room_id);
		if (room === undefined) return;
		const response: any = this.gameService.guessValidation(payload, room);
		if (!response) return;
		this.server.to(socketRoom).emit(WS_EVENTS.GUESS_UPDATE, response);
		this.gameService.checkEndOfTurn(room, this.server);
	}

	@SubscribeMessage(WS_EVENTS.STROKE_START)
	handleStrokeStart(
		@ConnectedSocket() client: Socket,
		@MessageBody() payload: DrawPayload,
	) {
		console.log('[recv] stroke:start'); 
		const socketRoom = 'room-' + payload.room_id;
		const room = this.roomService.getRoom(payload.room_id);
		if (!room) return;
		if (client.data.userId != room.drawer) return;
		// emit batch payload to the rooms clients
		console.log('[send] stroke:start');
		client.to(socketRoom).emit(WS_EVENTS.STROKE_START, payload);

		// add draw payload to the server?
		this.roomService.appendStrokes(payload.strokes, payload.room_id);
	}
	
	@SubscribeMessage(WS_EVENTS.STROKE_APPEND)
	handleStrokeAppend(
		@ConnectedSocket() client: Socket,
		@MessageBody() payload: StrokeAppendPayload,
	) {
		const room = this.roomService.getRoom(client.data.roomId);
		if (!room) return;
		const roomId = payload.room_id;
		if (client.data.userId !== room.drawer) return;
		const strokes = this.roomService.getStrokes(roomId);
		const s = strokes.find((x: any) => x.id === payload.id);
		if (s) s.points.push(...payload.points);

		client.to(`room-${payload.room_id}`).emit(WS_EVENTS.STROKE_APPEND, payload);
	}

	@SubscribeMessage(WS_EVENTS.CANVAS_CLEAR)
	handleCanvasClear(
		@ConnectedSocket() client: Socket,
	) {
		const room = this.roomService.getRoom(client.data.roomId);
			if (!room) return;
		if (client.data.userId !== room.drawer) return;
		this.roomService.clearStrokes(client.data.roomId);
		this.emitFullDrawingState(client.data.roomId);
	}	

	@SubscribeMessage(WS_EVENTS.CANVAS_UNDO)
	handleCanvasUndo(
		@ConnectedSocket() client: Socket,
	) {
		const room = this.roomService.getRoom(client.data.roomId);
			if (!room) return;
		if (client.data.userId !== room.drawer) return;
		this.roomService.popStroke(client.data.roomId);
		this.emitFullDrawingState(client.data.roomId);
	}

	// SERVER -> CLIENT HELPERS
	private emitFullDrawingState(roomId: number, client?: Socket) {
		const strokes = this.roomService.getStrokes(roomId);
		const payload = {
			room_id: roomId,
			strokes: strokes,
		}
		if (client)
			client.emit(WS_EVENTS.INIT_DRAWING, payload);
		else
			this.server.to('room-' + roomId).emit(WS_EVENTS.INIT_DRAWING, payload);
	}
}
