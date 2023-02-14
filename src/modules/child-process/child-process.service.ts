import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import { Socket } from 'socket.io';
import { AdminGateway } from '../command/admin.gateway';
import { CommandGateway } from '../command/command.gateway';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const kill = require('tree-kill');

@Injectable()
export class ChildProcessService {
  // private commandGateway: CommandGateway;
  constructor(
    @Inject(forwardRef(() => CommandGateway))
    private readonly commandGateway: CommandGateway,
    @Inject(forwardRef(() => AdminGateway))
    private readonly adminGateway: AdminGateway,
  ) {}
  async spawnChildProcess(command, client: Socket, src): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof command !== 'string') {
        reject(`command '${command}' is not string`);
      }
      command = `cd ${src} && ${command}`;
      const elements = command.split(/\s+/);
      const cmd = elements.shift();
      const result = spawn(cmd, elements, { shell: true });
      console.log('piddd', result.pid);
      const rs = {
        pid: result.pid,
      };

      result.stdout.on('data', (data) => {
        // rs.returnValues = data.toString();
        if (this.onData) this.onData(data.toString(), rs, client);
      });

      result.stderr.on('data', (data) => {
        // rs.errorValues = data.toString();
        if (this.onError) this.onError(data.toString(), rs, client);
      });

      result.on('close', (code) => {
        if (code == 0) {
          resolve(rs);
        } else {
          reject(rs);
        }
      });
    }).catch((e) => {
      return e;
    });
  }

  // async perform(command, client): Promise<any> {
  //   await this.spawnChildProcess(command, client, '');
  // }

  async onData(data, rs, client: Socket) {
    rs.returnValues = data;
    if (client.nsp.name === '/command')
      this.commandGateway.returnSocketData(client, rs);
    if (client.nsp.name === '/admin')
      this.adminGateway.returnSocketData(client, rs);
    return rs;
  }

  async onError(e, rs, client: Socket) {
    rs.errorValues = e;
    if (client.nsp.name === '/command')
      this.commandGateway.returnSocketData(client, rs);
    if (client.nsp.name === '/admin')
      this.adminGateway.returnSocketData(client, rs);
    return rs;
  }

  async kill(pid) {
    // console.log('kill', pid);
    await kill(pid);
    return `killed ${pid}`;
  }
}
