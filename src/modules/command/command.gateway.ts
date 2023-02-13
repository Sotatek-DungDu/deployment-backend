import { ProjectService } from './../project/project.service';
import { UserService } from './../user/user.service';
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
import { InputSocket } from './dto/input-socket.dto';
import jwtDecode from 'jwt-decode';
import { JwtPayload } from '../auth/strategy/jwt.payload';

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
    private readonly userService: UserService,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
  ) {}

  @WebSocketServer() io: Namespace;

  afterInit(): void {
    this.logger.log('Websocket Gateway initialized');
  }

  handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;
    this.logger.debug(
      `Socket connected with UserEmail: ${client.email} role: ${client.role}`,
    );
    this.logger.log(`WS client with id: ${client.id}} connected`);
    this.logger.debug(`Number of sockets connected: ${sockets.size}`);

    this.io.to(client.id).emit('command', `from ${client.id}`);
  }

  handleDisconnect(client: SocketWithAuth) {
    const sockets = this.io.sockets;
    this.logger.debug(
      `Socket disconnected with UserEmail: ${client.email} role: ${client.role}`,
    );
    this.logger.log(`WS client with id: ${client.id}} disconnected`);
    this.logger.debug(`Number of sockets connected: ${sockets.size}`);
  }

  @SubscribeMessage('command')
  async handleEvent(client: Socket, data: InputSocket): Promise<any> {
    // await this.childProcessService.perform(command, client);
    // this.io.to(client.id).emit('command', 'rs');
    const authToken = client.handshake?.headers?.token;
    const payload: JwtPayload = jwtDecode(authToken.toString());
    await this.projectService.performAction(
      data.project_id,
      payload.email,
      data.action,
      client,
    );
  }

  async returnSocketData(client: Socket, data: string): Promise<any> {
    this.io.to(client.id).emit('command', data);
  }
}
