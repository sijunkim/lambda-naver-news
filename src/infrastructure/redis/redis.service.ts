import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisConfig } from '../../config/redis.config';
import { RedisDataType } from '../../common/types/redis.enum';
import { RedisAnalysis, RedisInterface } from '../../common/interfaces/redis.interface';
/**
 * Redis 작업을 처리하는 서비스 클래스
 * Redis 연결 관리 및 데이터 분석 기능을 제공합니다.
 */
@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis;
  private readonly valueRetrievers: Record<RedisDataType, (key: string) => Promise<any>>;

  /**
   * RedisService 생성자
   * Redis 클라이언트를 초기화하고 값 조회 함수들을 설정합니다.
   * @param configService - NestJS 설정 서비스
   */
  constructor(private readonly configService: RedisConfig) {
    const redisConfig = this.configService.getConfig();
    this.redis = this.createRedisClient(redisConfig);
    this.valueRetrievers = this.initializeValueRetrievers();
  }

  /**
   * Redis 클라이언트 인스턴스를 생성합니다.
   * @param config - Redis 연결 설정
   * @returns {Redis} Redis 클라이언트 인스턴스
   */
  private createRedisClient(config: RedisInterface): Redis {
    return new Redis(config);
  }

  /**
   * Redis 데이터 타입별 값 조회 함수들을 초기화합니다.
   * @returns {Record<RedisDataType, Function>} 데이터 타입별 값 조회 함수 맵
   */
  private initializeValueRetrievers(): Record<RedisDataType, (key: string) => Promise<any>> {
    return {
      [RedisDataType.STRING]: (key: string) => this.redis.get(key),
      [RedisDataType.HASH]: (key: string) => this.redis.hgetall(key),
      [RedisDataType.LIST]: (key: string) => this.redis.lrange(key, 0, -1),
      [RedisDataType.SET]: (key: string) => this.redis.smembers(key),
      [RedisDataType.ZSET]: (key: string) => this.redis.zrange(key, 0, -1, 'WITHSCORES'),
      [RedisDataType.REJSON]: (key: string) => this.redis.call('JSON.GET', key),
    };
  }

  /**
   * Redis에 저장된 모든 키의 데이터를 분석합니다.
   * 각 키의 타입과 값을 조회하여 분석 결과를 반환합니다.
   * @returns {Promise<RedisAnalysis>} 키별 데이터 타입과 값 정보
   * @throws {Error} Redis 데이터 분석 중 오류 발생 시
   */
  async analyzeStoredData(): Promise<RedisAnalysis> {
    try {
      const keys = await this.redis.keys('*');
      const analysis: RedisAnalysis = {};

      await Promise.all(
        keys.map(async (key) => {
          const type = await this.redis.type(key);
          const value = await this.getValueByType(key, type);

          analysis[key] = {
            type,
            value,
          };
        }),
      );

      return analysis;
    } catch (error) {
      throw new Error(`Failed to analyze Redis data: ${error.message}`);
    }
  }

  /**
   * 주어진 키와 타입에 따라 Redis에서 값을 조회합니다.
   * @param key - 조회할 Redis 키
   * @param type - Redis 데이터 타입
   * @returns {Promise<any>} 조회된 값
   */
  private async getValueByType(key: string, type: string): Promise<any> {
    const retriever = this.valueRetrievers[type as RedisDataType];
    if (retriever) {
      return retriever(key);
    }

    const dumpValue = await this.redis.dump(key);
    return dumpValue ? dumpValue.toString() : null;
  }

  /**
   * 모듈이 종료될 때 Redis 연결을 정상적으로 종료합니다.
   * @returns {Promise<void>}
   */
  async onModuleDestroy() {
    await this.redis.quit();
  }
}
