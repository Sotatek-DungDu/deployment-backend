import { CommandService } from './command.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlainBody } from 'shares/decorators/plainbody.decorator';
import { ApiTags } from '@nestjs/swagger';
import { DecoratorText } from 'shares/decorators/plaintextswagger.decorator';
import { InputCommand } from './dto/input-command.dto';
@Controller()
@ApiTags('Command manage')
export class CommandController {
  constructor(private readonly commandService: CommandService) {}

  // @Post('command')
  // async processCommmand(@Body() command: InputCommand): Promise<any> {
  //   return await this.commandService.processCommmand(command);
  // }

  @Post('command/kill')
  @DecoratorText()
  async killProcess(@PlainBody() pid: number): Promise<any> {
    return await this.commandService.killProcess(pid);
  }
}
