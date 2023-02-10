import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @Prop()
  name: string;

  @Prop()
  src: string;

  @Prop({
    type: [
      {
        action: { type: String },
        command: { type: String },
      },
    ],
  })
  data: { action: string; command: string }[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    required: true,
  })
  permissions: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
