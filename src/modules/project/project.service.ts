import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from 'src/model/project.schema';
import { ChildProcessService } from '../child-process/child-process.service';
import { UserService } from '../user/user.service';
import { CreateCommand } from './dto/create-command.dto';
import { CreateProject } from './dto/create-new-project.dto';
import { forwardRef, Inject } from '@nestjs/common';
import { Socket } from 'socket.io';
import { InputCustomSocket } from '../command/dto/custom-socket-command.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel('Project')
    private readonly projectModel: Model<ProjectDocument>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => ChildProcessService))
    private readonly childProcessService: ChildProcessService,
  ) {}

  async getCommandByProjectId(
    project_id: string,
    email: string,
  ): Promise<ProjectDocument> {
    const user = await this.userService.findUserByEmail(email);
    const project = await this.projectModel
      .findOne({
        _id: project_id,
        permissions: { $in: user._id },
      })
      .select('data');
    if (!project) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    return project;
  }

  async getProjectByPermission(email: string): Promise<Project[]> {
    const user = await this.userService.findUserByEmail(email);
    const project = await this.projectModel.find({
      permissions: { $in: user._id },
    });
    if (!project) {
      throw new HttpException('NOT_FOUND', HttpStatus.NO_CONTENT);
    }
    return project;
  }

  async getAllProject(): Promise<Project[]> {
    return await this.projectModel.find();
  }

  async createProject(email: string, project: CreateProject): Promise<any> {
    const regex = new RegExp('^(/[^/ ]*)+/?$');
    if (regex.test(project.src) == false) {
      throw new HttpException('WRONG SOURCE FORMAT', HttpStatus.NOT_ACCEPTABLE);
    }
    const user = await this.userService.findUserByEmail(email);
    const newProject = {
      name: project.name,
      src: project.src,
      permissions: user._id,
    };
    return await new this.projectModel(newProject).save();
  }

  async createCommand(
    project_id: string,
    command: CreateCommand,
  ): Promise<any> {
    return await this.projectModel.updateOne(
      { _id: project_id },
      {
        $push: { data: command },
      },
    );
  }

  async getCommandByAction(
    project_id: string,
    email: string,
    action: any,
  ): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    if (user.role === 'ADMIN') {
      const data = await this.projectModel
        .findOne({
          _id: project_id,
          'data.action': action,
        })
        .select('data.command src');
      if (!data) {
        throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
      }
      return { src: data.src, command: data.data[0].command };
    } else {
      const data = await this.projectModel
        .findOne({
          _id: project_id,
          permissions: { $in: user._id },
          'data.action': action,
        })
        .select('data.command src');
      if (!data) {
        throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
      }
      return { src: data.src, command: data.data[0].command };
    }
  }

  async performAction(
    project_id: string,
    email: string,
    action: any,
    client: Socket,
  ): Promise<any> {
    const { src, command } = await this.getCommandByAction(
      project_id,
      email,
      action,
    );
    return await this.childProcessService.spawnChildProcess(
      command,
      client,
      src,
    );
  }

  async performCustomCommand(
    client: Socket,
    data: InputCustomSocket,
  ): Promise<any> {
    const project = await this.projectModel
      .findOne({ _id: data.project_id })
      .select('src');
    return await this.childProcessService.spawnChildProcess(
      data.command,
      client,
      project.src,
    );
  }

  async addPermissions(project_id: string, email: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    return await this.projectModel.updateOne(
      { _id: project_id },
      { $push: { permissions: user._id } },
    );
  }
}
