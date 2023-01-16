import { ChildProcessService } from './../child-process/child-process.service';
import { CommandController } from './command.controler';
import { CommandService } from './command.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [CommandService, ChildProcessService],
  controllers: [CommandController],
})
export class CommandModule {}
