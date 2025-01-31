import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisService } from './infrastructure/redis.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const redisService = app.get(RedisService);
  const analysis = await redisService.analyzeStoredData();
  console.log(analysis);

  await app.close();
}
bootstrap();
