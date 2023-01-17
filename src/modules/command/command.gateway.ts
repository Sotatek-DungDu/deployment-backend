import { Namespace, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { SocketWithAuth } from 'src/middleware/socket-middleware';

@WebSocketGateway({
  namespace: 'command',
})
export class CommandGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(CommandGateway.name);

  @WebSocketServer() io: Namespace;

  afterInit(): void {
    this.logger.log('Websocket Gateway initialized');
  }

  handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;
    this.logger.debug(`Socket connected with userID: ${client.user_id}"`);
    this.logger.log(`WS client with id: ${client.id}} connected to`);
    this.logger.debug(`Number of sockets connected: ${sockets.size}`);

    this.io.emit('hello', `from ${client.id}`);
  }

  handleDisconnect(client: SocketWithAuth) {
    const sockets = this.io.sockets;
    this.logger.debug(`Socket connected with userID: ${client.user_id}"`);
    this.logger.log(`WS client with id: ${client.id}} connected to`);
    this.logger.debug(`Number of sockets connected: ${sockets.size}`);
  }
}
