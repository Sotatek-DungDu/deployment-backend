import { PermissionsController } from './permissions.controller';
import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsEntity } from 'src/model/entities/permissions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionsEntity])],
  providers: [PermissionsService],
  controllers: [PermissionsController],
  exports: [PermissionsService],
})
export class PermissionsModule {}
