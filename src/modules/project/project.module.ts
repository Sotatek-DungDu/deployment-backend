import { ChildProcessModule } from './../child-process/child-process.module';
import { ProjectSchema } from './../../model/project.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { UserModule } from '../user/user.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }]),
    UserModule,
    ChildProcessModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [],
})
export class ProjectModule {}
