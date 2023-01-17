import { ChildProcessService } from './../child-process/child-process.service';
import { CommandController } from './command.controler';
import { CommandService } from './command.service';
import { Module } from '@nestjs/common';
import { CommandGateway } from './socket/command.gateway';

@Module({
  providers: [CommandService, ChildProcessService, CommandGateway],
  controllers: [CommandController],
})
export class CommandModule {}
