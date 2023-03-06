import { ProjectService } from './project.service';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Get Data Project By Id' })
  async getCommandByProjectId(
    @Param('id') project_id: string,
    @UserEmail() email: string,
  ): Promise<any> {
    return await this.projectService.getCommandByProjectId(project_id, email);
  }

  @Get('project')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get Data Project' })
  async getProject(@UserEmail() email: string): Promise<Project[]> {
    return await this.projectService.getProjectByPermission(email);
  }

  @Get('admin/project')
  @ApiBearerAuth()
  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Admin Get Data All Project' })
  async adminGetProject(): Promise<Project[]> {
    return await this.projectService.getAllProject();
  }

  @Post('admin/project')
  @ApiBearerAuth()
  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Admin Create Project' })
  async createProject(
    @UserEmail() email: string,
    @Body() project: CreateProject,
  ): Promise<any> {
    return await this.projectService.createProject(email, project);
  }

  @Post('admin/project/:id')
  @ApiBearerAuth()
  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Admin Create Command By Id' })
  async createCommand(
    @Param('id') project_id: string,
    @Body() command: CreateCommand,
  ): Promise<any> {
    return await this.projectService.createCommand(project_id, command);
  }

  // @Post('project/action/:id')
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({ summary: 'Perform Action' })
  // async getContentCommand(
  //   @Param('id') project_id: string,
  //   @UserEmail() email: string,
  //   @Body() action: InputAction,
  // ): Promise<any> {
  //   return await this.projectService.performAction(project_id, email, action);
  // }

  @Post('admin/project/permissions/:id')
  @ApiBearerAuth()
  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @DecoratorText()
  @ApiOperation({ summary: 'Admin Add Project Permissions' })
  async addPermissions(
    @Param('id') project_id: string,
    @PlainBody() email: string,
  ): Promise<any> {
    return await this.projectService.addPermissions(project_id, email);
  }
}
