import { Module } from '@nestjs/common';
import { ConfigModule as NestConfig } from '@nestjs/config';
import { RedisConfig } from './redis.config';
import { NaverConfig } from './naver.config';
import { SlackConfig } from './slack.config';

@Module({
  imports: [NestConfig],
  providers: [NaverConfig, RedisConfig, SlackConfig],
  exports: [NaverConfig, RedisConfig, SlackConfig],
})
export class ConfigModule {}
