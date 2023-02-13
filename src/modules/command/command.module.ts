import { UserModule } from './../user/user.module';
import { ChildProcessModule } from './../child-process/child-process.module';
import { CommandController } from './command.controler';
import { CommandService } from './command.service';
import { Module, forwardRef } from '@nestjs/common';
import { CommandGateway } from './command.gateway';
import { AdminGateway } from './admin.gateway';
import { ProjectModule } from '../project/project.module';

@Module({
  providers: [CommandService, CommandGateway, AdminGateway],
  controllers: [CommandController],
  exports: [CommandGateway],
  imports: [
    UserModule,
    forwardRef(() => ProjectModule),
    forwardRef(() => ChildProcessModule),
  ],
})
export class CommandModule {}
