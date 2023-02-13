import { ProjectService } from './project.service';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEmail } from 'shares/decorators/get-user-email.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateProject } from './dto/create-new-project.dto';
import { CreateCommand } from './dto/create-command.dto';
import { Project } from 'src/model/project.schema';
import { InputAction } from './dto/input-action.dto';
import { hasRoles } from 'shares/decorators/role.decorator';
import { RolesGuard } from '../auth/guard/role.guard';
import { UserRole } from 'src/model/user.schema';
import { DecoratorText } from 'shares/decorators/plaintextswagger.decorator';
import { PlainBody } from 'shares/decorators/plainbody.decorator';

@Controller()
@ApiTags('Project manage')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('project/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Get Data Project By Id' })
  async getCommandByProjectId(
    @Param('id') project_id: string,
    @UserEmail() email: string,
  ): Promise<any> {
    return await this.projectService.getCommandByProjectId(project_id, email);
  }

  @Get('project')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Get Data Project' })
  async getProject(@UserEmail() email: string): Promise<Project[]> {
    return await this.projectService.getProject(email);
  }

  @Post('project')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Create Project' })
  async createProject(
    @UserEmail() email: string,
    @Body() project: CreateProject,
  ): Promise<any> {
    return await this.projectService.createProject(email, project);
  }

  @Post('project/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Create Command By Id' })
  async createCommand(
    @Param('id') project_id: string,
    @Body() command: CreateCommand,
  ): Promise<any> {
    return await this.projectService.createCommand(project_id, command);
  }

  // @Post('project/action/:id')
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @ApiOkResponse({ description: 'Perform Action' })
  // async getContentCommand(
  //   @Param('id') project_id: string,
  //   @UserEmail() email: string,
  //   @Body() action: InputAction,
  // ): Promise<any> {
  //   return await this.projectService.performAction(project_id, email, action);
  // }

  @Post('project/permissions/:id')
  @ApiBearerAuth()
  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @DecoratorText()
  @ApiOkResponse({ description: 'Add Permissions' })
  async addPermissions(
    @Param('id') project_id: string,
    @PlainBody() email: string,
  ): Promise<any> {
    return await this.projectService.addPermissions(project_id, email);
  }
}
