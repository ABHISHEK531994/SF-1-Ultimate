// /apps/community-service/src/config/redis.ts
import { createClient } from 'redis';
import { logger } from '../utils/logger';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = createClient({
  url: redisUrl
});

redis.on('error', (error) => {
  logger.error('[Redis] Error:', error);
});

redis.on('connect', () => {
  logger.info('[Redis] Connected successfully');
});

export async function connectRedis(): Promise<void> {
  await redis.connect();
}
