import { Get, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/model/entities/project.entity';
import { Repository } from 'typeorm';
import { PermissionsService } from '../auth/permission/permissions.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private readonly permissionsService: PermissionsService,
  ) {}

  async getCommandByProjectId(
    project_id: number,
    user_id: number,
  ): Promise<any> {
    const project = await this.projectRepository.findOne({
      where: { project_id: project_id },
      relations: { command: true },
    });
    if (!project) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);

    if (
      await this.permissionsService.getPermisionByProjectIdAndUserId(
        project.project_id,
        user_id,
      )
    ) {
      return project;
    } else throw new HttpException('NOT_ACCEPTABLE', HttpStatus.NOT_ACCEPTABLE);
  }
}
