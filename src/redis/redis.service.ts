import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  onModuleInit() {
    // ! ?family=0 is needed for railway hosting provider to use both IPv4 and IPv6 addresses
    // https://docs.railway.com/reference/errors/enotfound-redis-railway-internal
    this.client = new Redis(process.env.REDIS_URL + '?family=0');
  }

  onModuleDestroy() {
    this.client.quit();
  }

  async set(key: string, value: string, expiresInSeconds: number): Promise<void> {
    await this.client.set(key, value, 'EX', expiresInSeconds);
  }

  get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  del(key: string): Promise<number> {
    return this.client.del(key);
  }
}
