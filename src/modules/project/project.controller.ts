import { ProjectService } from './project.service';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProjectEntity } from 'src/model/entities/project.entity';
import { UserID } from 'shares/decorators/get-user-id.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller()
@ApiTags('Project manage')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('project/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getCommandByProjectId(
    @Param('id', ParseIntPipe) project_id: number,
    @UserID() user_id: number,
  ): Promise<any> {
    return await this.projectService.getCommandByProjectId(project_id, user_id);
  }
}
