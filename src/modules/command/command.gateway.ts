import { ProjectService } from './../project/project.service';
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
  namespace: 'command',
})
export class CommandGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(CommandGateway.name);
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
    this.logger.debug(`Socket connected with UserEmail: ${client.email}"`);
    this.logger.log(`WS client with id: ${client.id}} connected`);
    this.logger.debug(`Number of sockets connected: ${sockets.size}`);

    this.io.to(client.id).emit('command', `from ${client.id}`);
  }

  handleDisconnect(client: SocketWithAuth) {
    const sockets = this.io.sockets;
    this.logger.debug(`Socket disconnected with UserEmail: ${client.email}"`);
    this.logger.log(`WS client with id: ${client.id}} disconnected`);
    this.logger.debug(`Number of sockets connected: ${sockets.size}`);
  }

  @SubscribeMessage('command')
  async handleEvent(client: Socket, command: string): Promise<any> {
    // console.log('client', client.id);
    await this.childProcessService.perform(command, client);
    // this.io.to(client.id).emit('command', 'rs');
  }

  async returnSocketData(client: Socket, data: string): Promise<any> {
    this.io.to(client.id).emit('command', data);
  }
}
