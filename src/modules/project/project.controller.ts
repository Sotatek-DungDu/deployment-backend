import { ProjectService } from './project.service';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProjectEntity } from 'src/model/entities/project.entity';

@Controller()
@ApiTags('Project manage')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('project')
  async getall(): Promise<ProjectEntity[]> {
    return await this.projectService.getAll();
  }
}
