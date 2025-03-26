/*
https://docs.nestjs.com/websockets/gateways#gateways
*/

import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class AccountGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

    @WebSocketServer()
    server: Server;

    private connectedClients = new Map<string, Socket>();
    private userIdToSocket = new Map<string, Socket>();


    @SubscribeMessage('accountActivated')
    handleAccountActivated(@ConnectedSocket() client: Socket, @MessageBody() userId: string, ) {
        client.emit('activationStatus', { userId, status: 'activated' })
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log(`User connected: ${client.id}`);
        this.connectedClients.set(client.id, client); // Guardar cliente conectado
    }

    handleDisconnect(client: Socket) {
        console.log(`User disconnected: ${client.id}`);
        this.connectedClients.delete(client.id); // Remover cliente desconectado
    }

    afterInit(server: Server) {
        console.log('Socket is live')
    }

    getClientById(clientId: string): Socket | undefined {
        return this.connectedClients.get(clientId);
    }
}
