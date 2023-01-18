import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';

@Injectable()
export class ChildProcessService {
  async spawnChildProcess({ command, onData, onError }): Promise<any> {
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
        if (onData) onData(data.toString(), rs);
      });

      result.stderr.on('data', (data) => {
        // rs.errorValues = data.toString();
        if (onError) onError(data.toString(), rs);
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

  async perform(command): Promise<any> {
    const rs = await this.spawnChildProcess({
      command,
      onData,
      onError,
    });
    return rs;
  }

  async kill(pid) {
    console.log('kill', pid);
    return process.kill(pid);
  }
}

function onData(data, rs) {
  rs.returnValues = data;
  return rs;
}

function onError(e, rs) {
  rs.errorValues = e;
  return rs;
}
