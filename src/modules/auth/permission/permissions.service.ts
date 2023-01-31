import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionsEntity } from 'src/model/entities/permissions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(PermissionsEntity)
    private readonly permissionsRepository: Repository<PermissionsEntity>,
  ) {}

  async getPermisionByUserId(user_id: number): Promise<any> {
    return await this.permissionsRepository.find({
      relations: { project: true },
      where: { user: { user_id: user_id } },
    });
  }

  async getPermisionByProjectIdAndUserId(
    project_id: number,
    user_id: number,
  ): Promise<boolean> {
    const permission = await this.permissionsRepository.findOne({
      where: {
        project: { project_id: project_id },
        user: {
          user_id: user_id,
        },
      },
    });
    if (!permission) {
      return false;
    } else return true;
  }
}
