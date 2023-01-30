import { ChildProcessModule } from './../child-process/child-process.module';
import { ChildProcessService } from './../child-process/child-process.service';
import { CommandController } from './command.controler';
import { CommandService } from './command.service';
import { Module, forwardRef } from '@nestjs/common';
import { CommandGateway } from './command.gateway';

@Module({
  providers: [CommandService, CommandGateway],
  controllers: [CommandController],
  exports: [CommandGateway],
  imports: [forwardRef(() => ChildProcessModule)],
})
export class CommandModule {}
