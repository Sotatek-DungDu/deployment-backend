import { CommandModule } from './../command/command.module';
import { CommandGateway } from './../command/command.gateway';
import { forwardRef, Module } from '@nestjs/common';
import { ChildProcessService } from './child-process.service';

@Module({
  providers: [ChildProcessService],
  exports: [ChildProcessService],
  imports: [forwardRef(() => CommandModule)],
})
export class ChildProcessModule {}
