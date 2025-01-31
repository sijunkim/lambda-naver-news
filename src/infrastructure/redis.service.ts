import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor(private readonly configService: ConfigService) {
    if (!process.env.REDIS_HOST || !process.env.REDIS_PORT || !process.env.REDIS_PASSWORD) {
      throw new Error('Redis environment variables are not set');
    }
    const host = this.configService.get('REDIS_HOST');
    const port = Number(this.configService.get('REDIS_PORT'));
    const password = this.configService.get('REDIS_PASSWORD');
    const username = this.configService.get('REDIS_USERNAME');

    this.redis = new Redis({ host, port, password, username });
  }

  async analyzeStoredData() {
    const keys = await this.redis.keys('*');
    const analysis = {};

    for (const key of keys) {
      const type = await this.redis.type(key);
      let value;

      switch (type) {
        case 'string':
          value = await this.redis.get(key);
          break;
        case 'hash':
          value = await this.redis.hgetall(key);
          break;
        case 'list':
          value = await this.redis.lrange(key, 0, -1);
          break;
        case 'set':
          value = await this.redis.smembers(key);
          break;
        case 'zset':
          value = await this.redis.zrange(key, 0, -1, 'WITHSCORES');
          break;
        case 'ReJSON-RL':
          value = await this.redis.call('JSON.GET', key);
          break;
        default:
          const dumpValue = await this.redis.dump(key);
          value = dumpValue ? dumpValue.toString() : null;
      }

      analysis[key] = {
        type,
        value,
      };
    }

    return analysis;
  }
}
