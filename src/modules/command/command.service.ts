import { ChildProcessService } from './../child-process/child-process.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InputCommand } from './dto/input-command.dto';

@Injectable()
export class CommandService {
  constructor(private readonly childProcessService: ChildProcessService) {}

  async processCommmand(command: InputCommand): Promise<any> {
    if (command.command === '' && command.src === '')
      throw new HttpException(
        'Input not accepted',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    return await this.childProcessService.spawnChildProcess(
      command.command,
      null,
      command.src,
    );
  }

  async killProcess(pid: number): Promise<any> {
    return await this.childProcessService.kill(pid);
  }
}
