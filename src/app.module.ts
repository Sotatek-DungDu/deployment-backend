import { Module } from '@nestjs/common';
import { Modules } from './module';

@Module({
  imports: Modules,
  controllers: [],
  providers: [],
})
export class AppModule {}
