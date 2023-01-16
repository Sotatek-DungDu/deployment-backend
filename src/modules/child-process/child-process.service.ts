import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';

@Injectable()
export class ChildProcessService {
  async spawnChildProcess(command): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof command !== 'string') {
        reject(`command '${command}' is not string`);
      }
      const elements = command.split(/\s+/);
      const cmd = elements.shift();
      const result = spawn(cmd, elements, { shell: true });

      const rs = {
        returnValues: null,
        errorValues: null,
        code: null,
      };
      result.stdout.on('data', (data) => {
        console.log('stdout', data.toString());
        rs.returnValues = data.toString();
      });

      result.stderr.on('data', (data) => {
        console.log('stderr', data.toString());
        rs.errorValues = data.toString();
      });

      result.on('close', (code) => {
        console.log('onclose', code);
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
}
