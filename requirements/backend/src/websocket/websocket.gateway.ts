import {
	WebSocketGateway,
	OnGatewayInit,
	OnGatewayConnection,
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway {
	afterInit() {
		console.log('WebSocket Gateway initialized');
	}

	handleConnection(client: Socket) {
		console.log('Client conencted: ', client.id);
	}

	@SubscribeMessage('ping')
	handlePing(
		@MessageBody() data: any,
		@ConnectedSocket() client: Socket,
	) {
		console.log('Received ping from', client.id, 'with data: ', data);
		client.emit('pong', {
			received: data,
			serverTime: Date.now(),
		});
	}
}