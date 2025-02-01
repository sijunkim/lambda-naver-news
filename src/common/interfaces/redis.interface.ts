import { Redis } from 'ioredis';

export interface RedisAnalysis {
  [key: string]: {
    type: string;
    value: any;
  };
}

export interface RedisInterface {
  host: string;
  port: number;
  password: string;
  username?: string;
}

export interface RedisValueRetriever {
  [key: string]: (redis: Redis, key: string) => Promise<any>;
}
