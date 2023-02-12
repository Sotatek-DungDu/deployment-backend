import { Namespace, Socket } from 'socket.io';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';
import { SocketWithAuth } from 'src/middleware/socket-middleware';
import { ChildProcessService } from '../child-process/child-process.service';

@WebSocketGateway({
  namespace: 'admin',
})
export class AdminGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(AdminGateway.name);
  constructor(
    @Inject(forwardRef(() => ChildProcessService))
    private readonly childProcessService: ChildProcessService,
  ) {}

  @WebSocketServer() io: Namespace;

  afterInit(): void {
    this.logger.log('Websocket Gateway initialized');
  }

  handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;
    this.logger.debug(
      `Admin Socket connected with UserEmail: ${client.email} role: ${client.role}`,
    );
    this.logger.log(`WS client with id: ${client.id}} connected`);
    this.logger.debug(`Number of Admin sockets connected: ${sockets.size}`);

    this.io.to(client.id).emit('command', `from ${client.id}`);
  }

  handleDisconnect(client: SocketWithAuth) {
    const sockets = this.io.sockets;
    this.logger.debug(
      `Admin Socket disconnected with UserEmail: ${client.email} role: ${client.role}`,
    );
    this.logger.log(`WS client with id: ${client.id}} disconnected`);
    this.logger.debug(`Number of Admin sockets connected: ${sockets.size}`);
  }
}
