import { CommandEntity } from './../../model/entities/command.entity';
import { ChildProcessService } from './../child-process/child-process.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommandService {
  constructor(
    private readonly childProcessService: ChildProcessService,
    @InjectRepository(CommandEntity)
    private readonly commandRepository: Repository<CommandEntity>,
  ) {}
  async processCommmand(command: string): Promise<any> {
    if (command === '')
      throw new HttpException(
        'Input not accepted',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    return await this.childProcessService.spawnChildProcess(command, null);
  }

  async killProcess(pid: number): Promise<any> {
    return await this.childProcessService.kill(pid);
  }
}
