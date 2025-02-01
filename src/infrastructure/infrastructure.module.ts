import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '../config/config.module';
@Module({
  imports: [RedisModule],
  providers: [],
  exports: [RedisModule],
})
export class InfrastructureModule {}
