import { Redis } from 'ioredis';

export enum RedisDataType {
  STRING = 'string',
  HASH = 'hash',
  LIST = 'list',
  SET = 'set',
  ZSET = 'zset',
  REJSON = 'ReJSON-RL',
}

export interface RedisAnalysis {
  [key: string]: {
    type: string;
    value: any;
  };
}

export interface RedisConfig {
  host: string;
  port: number;
  password: string;
  username?: string;
}

export interface RedisValueRetriever {
  [key: string]: (redis: Redis, key: string) => Promise<any>;
}
