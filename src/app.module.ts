import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './infrastructure/redis.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [AppService, RedisService],
})
export class AppModule {}
