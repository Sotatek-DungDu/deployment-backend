import { Namespace, Socket } from 'socket.io';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { SocketWithAuth } from 'src/middleware/socket-middleware';
import { ChildProcessService } from '../child-process/child-process.service';
import jwtDecode from 'jwt-decode';
import { ProjectService } from '../project/project.service';
import { JwtPayload } from '../auth/strategy/jwt.payload';
import { InputCustomSocket } from './dto/custom-socket-command.dto';
import { InputSocket } from './dto/input-socket.dto';

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

  @SubscribeMessage('custom')
  async handleCustomCommand(
    client: Socket,
    data: InputCustomSocket,
  ): Promise<any> {
    await this.projectService.performCustomCommand(client, data);
  }

  async returnSocketData(client: Socket, data: string): Promise<any> {
    this.io.to(client.id).emit('command', data);
  }
}
