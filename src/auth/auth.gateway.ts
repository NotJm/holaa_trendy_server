import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway({
    cors: {
        origin: ['http://localhost:4200'], // Dominios permitidos (el dominio de tu frontend)
        credentials: true, // Si necesitas credenciales o cookies
      },
      transports: ['websocket'], // Forzar el uso de WebSockets en lugar de polling
})
export class AuthGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string) {
    this.server.emit('events', data);
  }

  handleConnection(client: any, ...args: any[]) {}

  handleDisconnect(client: any) {}

  afterInit(server: any) {
    console.log('Socket is live');
  }

  send_verify_emai_successfully(email: string) {
    this.server.emit('verification_successfully', email);
  }
}
