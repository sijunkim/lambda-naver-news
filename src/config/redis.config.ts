import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigInterface } from '../common/interfaces/config.interface';
import { RedisInterface } from '../common/interfaces/redis.interface';

@Injectable()
export class RedisConfig implements ConfigInterface<RedisInterface> {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Redis 연결 설정을 환경 변수에서 가져옵니다.
   * @throws {Error} 필수 환경 변수가 없는 경우 에러를 발생시킵니다.
   * @returns {RedisConfig} Redis 연결 설정 객체
   */
  getConfig(): RedisInterface {
    this.validateConfig();

    return {
      host: this.configService.get('REDIS_HOST') || '',
      port: Number(this.configService.get('REDIS_PORT')) || 0,
      password: this.configService.get('REDIS_PASSWORD') || '',
      username: this.configService.get('REDIS_USERNAME') || '',
    };
  }

  validateConfig(): void {
    const requiredEnvVars = ['REDIS_HOST', 'REDIS_PORT', 'REDIS_PASSWORD'];
    const missingVars = requiredEnvVars.filter((varName) => !this.configService.get(varName));

    if (missingVars.length > 0) {
      throw new Error(`Missing required Redis environment variables: ${missingVars.join(', ')}`);
    }
  }
}
