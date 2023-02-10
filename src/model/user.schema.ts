import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
export enum UserRole {
  DEV = 'DEV',
  ADMIN = 'ADMIN',
}
@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  @IsEmail()
  email: string;

  @Prop()
  password: string;

  @Prop()
  profileImg: string;

  @Prop({
    type: String,
    default: 'DEV',
    enum: UserRole,
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
