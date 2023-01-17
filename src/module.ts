import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UserEntity } from './model/entities/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { ChildProcessModule } from './modules/child-process/child-process.module';
import { CommandModule } from './modules/command/command.module';
import { UserModule } from './modules/user/user.module';

export const Modules = [
  TypeOrmModule.forRootAsync({
    useFactory: () => ({
      type: 'mysql',
      host: process.env.HOST,
      port: parseInt(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [UserEntity],
      synchronize: true,
    }),
  }),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', '..', 'public'),
  }),
  ConfigModule.forRoot(),
  UserModule,
  AuthModule,
  ChildProcessModule,
  CommandModule,
];
