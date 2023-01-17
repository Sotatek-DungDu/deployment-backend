import { Namespace, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';

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

  handleConnection(client: Socket) {
    const sockets = this.io.sockets;
    console.log(client);
    this.logger.log(`WS client with id: ${client.id}} connected to`);
    this.logger.debug(`Number of sockets connected: ${sockets.size}`);

    this.io.emit('hello', `from ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const sockets = this.io.sockets;

    this.logger.log(`WS client with id: ${client.id}} connected to`);
    this.logger.debug(`Number of sockets connected: ${sockets.size}`);
  }
}
