import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import { CommandGateway } from '../command/command.gateway';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const kill = require('tree-kill');

@Injectable()
export class ChildProcessService {
  // private commandGateway: CommandGateway;
  constructor(
    @Inject(forwardRef(() => CommandGateway))
    private readonly commandGateway: CommandGateway,
  ) {}
  async spawnChildProcess(command, client): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof command !== 'string') {
        reject(`command '${command}' is not string`);
      }
      const elements = command.split(/\s+/);
      const cmd = elements.shift();
      const result = spawn(cmd, elements, { shell: true });
      console.log('piddd', result.pid);
      const rs = {
        pid: result.pid,
        code: null,
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
        rs.code = code;
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

  async perform(command, client): Promise<any> {
    await this.spawnChildProcess(command, client);
  }

  async onData(data, rs, client) {
    rs.returnValues = data;
    this.commandGateway.returnSocketData(client, rs);
    return rs;
  }

  async onError(e, rs, client) {
    rs.errorValues = e;
    this.commandGateway.returnSocketData(client, rs);
    return rs;
  }

  async kill(pid) {
    console.log('kill', pid);
    return kill(pid);
  }
}
