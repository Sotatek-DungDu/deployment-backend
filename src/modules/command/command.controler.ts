import { CommandService } from './command.service';
import { Controller, Get, Post } from '@nestjs/common';
import { PlainBody } from 'shares/decorators/plainbody.decorator';
import { ApiTags } from '@nestjs/swagger';
import { DecoratorText } from 'shares/decorators/plaintextswagger.decorator';
@Controller()
@ApiTags('Command manage')
export class CommandController {
  constructor(private readonly commandService: CommandService) {}
  @Post('command')
  @DecoratorText()
  async processCommmand(@PlainBody() command: string): Promise<any> {
    return await this.commandService.processCommmand(command);
  }

  @Post('command/kill')
  @DecoratorText()
  async killProcess(@PlainBody() pid: number): Promise<any> {
    return await this.commandService.killProcess(pid);
  }
}
