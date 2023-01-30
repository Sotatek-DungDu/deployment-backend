import { CommandService } from './command.service';
import { Controller, Get } from '@nestjs/common';
import { PlainBody } from 'shares/decorators/plainbody.decorator';
@Controller()
export class CommandController {
  constructor(private readonly commandService: CommandService) {}
  @Get('command')
  async processCommmand(@PlainBody() command: string): Promise<any> {
    return await this.commandService.processCommmand(command);
  }

  @Get('command/kill')
  async killProcess(@PlainBody() pid: number): Promise<any> {
    return await this.commandService.killProcess(pid);
  }
}
