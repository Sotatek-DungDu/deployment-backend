import { CommandGateway } from './../command/command.gateway';
import { Module } from '@nestjs/common';
import { ChildProcessService } from './child-process.service';

@Module({
  providers: [ChildProcessService, CommandGateway],
  exports: [ChildProcessService],
})
export class ChildProcessModule {}
