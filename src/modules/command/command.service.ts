import { ChildProcessService } from './../child-process/child-process.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class CommandService {
  constructor(private readonly childProcessService: ChildProcessService) {}
  async processCommmand(command: string): Promise<any> {
    if (command === '')
      throw new HttpException(
        'Input not accepted',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    return await this.childProcessService.perform(command);
  }

  async killProcess(pid: number): Promise<any> {
    return await this.childProcessService.kill(pid);
  }
}
