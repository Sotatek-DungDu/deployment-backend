import { ChildProcessModule } from './../child-process/child-process.module';
import { CommandController } from './command.controler';
import { CommandService } from './command.service';
import { Module, forwardRef } from '@nestjs/common';
import { CommandGateway } from './command.gateway';
import { AdminGateway } from './admin.gateway';

@Module({
  providers: [CommandService, CommandGateway, AdminGateway],
  controllers: [CommandController],
  exports: [CommandGateway],
  imports: [forwardRef(() => ChildProcessModule)],
})
export class CommandModule {}
