import { ChildProcessService } from './../child-process/child-process.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommandService {
  constructor(private readonly childProcessService: ChildProcessService) {}
  async processCommmand(command: string): Promise<any> {
    return await this.childProcessService.spawnChildProcess(command);
  }
}
