import { ProjectEntity } from './../../model/entities/project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { PermissionsEntity } from 'src/model/entities/permissions.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, PermissionsEntity])],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [],
})
export class ProjectModule {}
