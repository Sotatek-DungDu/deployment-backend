import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { ChildProcessModule } from './modules/child-process/child-process.module';
import { CommandModule } from './modules/command/command.module';
import { UserModule } from './modules/user/user.module';
import { ProjectModule } from './modules/project/project.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './model/user.schema';
import { ProjectSchema } from './model/project.schema';

export const Modules = [
  MongooseModule.forRoot(process.env.MONGO_URI),
  MongooseModule.forFeature([
    { name: 'User', schema: UserSchema },
    { name: 'Project', schema: ProjectSchema },
  ]),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', '..', 'public'),
  }),
  ConfigModule.forRoot(),
  UserModule,
  AuthModule,
  ChildProcessModule,
  CommandModule,
  ProjectModule,
];
