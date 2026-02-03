import {
	WebSocketGateway,
	OnGatewayInit,
	OnGatewayConnection,
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ConnectionRegistry } from './websocket.service';

@WebSocketGateway()
export class WebsocketGateway {
	constructor(
		private readonly registry: ConnectionRegistry,
	) {}
	afterInit() {
		console.log('WebSocket Gateway initialized');
	}
	//follwing two are automatically claled by NestJS
	handleConnection(client: Socket) {
		console.log('Client conencted: ', client.id);
	}

	handleDisconnect(client: Socket) {
		const userId = client.data.userId;
		if (!userId) return;
		this.registry.removeConnection(userId, client);
		console.log(`Client ${client.id} with user id ${client.data.userId} disconnected`);
	}

	@SubscribeMessage('whoAmI')
	handlePing(
		@MessageBody() data: any,
		@ConnectedSocket() client: Socket,
	) {
		console.log('Received whoAmI from', client.data.userId, 'with data: ', data);
		client.emit('youAre', {
			userId: client.data.userId ?? null,
		});
	}

	@SubscribeMessage('identify')
	handleIdentify(
		@MessageBody() data: { userId: number },
		@ConnectedSocket() socket: Socket,
	) {
		socket.data.userId = data.userId;
		this.registry.addConnection(data.userId, socket);
		console.log(`Socket ${socket.id} identified as user ${data.userId}`);
		socket.emit('identified');
	}
}