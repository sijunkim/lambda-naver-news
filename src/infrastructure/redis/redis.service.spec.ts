import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { RedisConfig } from '../../config/redis.config';
import { Redis } from 'ioredis';
import { RedisDataType } from '../../common/types/redis.enum';

// Redis 모듈 모킹 방식 변경
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    keys: jest.fn(),
    type: jest.fn(),
    get: jest.fn(),
    hgetall: jest.fn(),
    lrange: jest.fn(),
    smembers: jest.fn(),
    zrange: jest.fn(),
    call: jest.fn(),
    dump: jest.fn(),
    quit: jest.fn(),
  }));
});

describe('RedisService', () => {
  let service: RedisService;
  let mockRedis: jest.Mocked<Redis>;
  let mockRedisConfig: jest.Mocked<RedisConfig>;

  beforeEach(async () => {
    // Redis 인스턴스 가져오기
    mockRedis = new Redis() as jest.Mocked<Redis>;

    mockRedisConfig = {
      getConfig: jest.fn().mockReturnValue({
        host: 'localhost',
        port: 6379,
        password: 'test',
      }),
      validateConfig: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: RedisConfig,
          useValue: mockRedisConfig,
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  describe('analyzeStoredData', () => {
    it('문자열 타입의 데이터를 정상적으로 분석해야 합니다', async () => {
      mockRedis.keys.mockResolvedValue(['key1']);
      mockRedis.type.mockResolvedValue(RedisDataType.STRING);
      mockRedis.get.mockResolvedValue('value1');

      const result = await service.analyzeStoredData();

      expect(result).toEqual({
        key1: {
          type: RedisDataType.STRING,
          value: 'value1',
        },
      });
    });

    it('해시 타입의 데이터를 정상적으로 분석해야 합니다', async () => {
      mockRedis.keys.mockResolvedValue(['hash1']);
      mockRedis.type.mockResolvedValue(RedisDataType.HASH);
      mockRedis.hgetall.mockResolvedValue({ field1: 'value1' });

      const result = await service.analyzeStoredData();

      expect(result).toEqual({
        hash1: {
          type: RedisDataType.HASH,
          value: { field1: 'value1' },
        },
      });
    });

    it('여러 키를 동시에 분석할 수 있어야 합니다', async () => {
      mockRedis.keys.mockResolvedValue(['key1', 'hash1']);
      mockRedis.type.mockResolvedValueOnce(RedisDataType.STRING).mockResolvedValueOnce(RedisDataType.HASH);
      mockRedis.get.mockResolvedValue('string-value');
      mockRedis.hgetall.mockResolvedValue({ field1: 'hash-value' });

      const result = await service.analyzeStoredData();

      expect(result).toEqual({
        key1: {
          type: RedisDataType.STRING,
          value: 'string-value',
        },
        hash1: {
          type: RedisDataType.HASH,
          value: { field1: 'hash-value' },
        },
      });
    });

    it('Redis 에러가 발생하면 적절한 에러를 던져야 합니다', async () => {
      const errorMessage = 'Redis connection failed';
      mockRedis.keys.mockRejectedValue(new Error(errorMessage));

      await expect(service.analyzeStoredData()).rejects.toThrow(`Failed to analyze Redis data: ${errorMessage}`);
    });
  });
});
