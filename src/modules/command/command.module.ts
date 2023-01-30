import { CommandEntity } from './../../model/entities/command.entity';
import { ChildProcessModule } from './../child-process/child-process.module';
import { CommandController } from './command.controler';
import { CommandService } from './command.service';
import { Module, forwardRef } from '@nestjs/common';
import { CommandGateway } from './command.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [CommandService, CommandGateway],
  controllers: [CommandController],
  exports: [CommandGateway],
  imports: [
    forwardRef(() => ChildProcessModule),
    TypeOrmModule.forFeature([CommandEntity]),
  ],
})
export class CommandModule {}
