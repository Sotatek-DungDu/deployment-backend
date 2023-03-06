import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Model } from 'mongoose';
import { ProjectDocument } from 'src/model/project.schema';

@ValidatorConstraint({ name: 'IsUnique', async: true })
@Injectable()
export class UniqueValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectModel('Project')
    private readonly projectModel: Model<ProjectDocument>,
  ) {}
  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const field = args.property;
    const count = await this.projectModel.count({ [field]: value });
    return !count;
  }

  defaultMessage(args: ValidationArguments) {
    return `this ${args.property} field is already taken`;
  }
}
