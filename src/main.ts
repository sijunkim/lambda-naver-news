import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisService } from './infrastructure/redis/redis.service';
import { SlackService } from './webhook/slack.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const redisService = app.get(RedisService);
  const analysis = await redisService.analyzeStoredData();
  console.log(analysis);

  const slackService = app.get(SlackService);
  await slackService.newsSend();

  await app.close();
}
bootstrap();
