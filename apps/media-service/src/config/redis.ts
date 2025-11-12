// /apps/media-service/src/config/redis.ts
import { createClient } from 'redis';
import { logger } from '../utils/logger';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = createClient({
  url: REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error('[Redis] Too many reconnect attempts');
        return new Error('Redis reconnect failed');
      }
      return Math.min(retries * 100, 3000);
    }
  }
});

redis.on('error', (error) => {
  logger.error('[Redis] Error:', error);
});

redis.on('connect', () => {
  logger.info('[Redis] Connected');
});

redis.on('reconnecting', () => {
  logger.warn('[Redis] Reconnecting...');
});

export async function connectRedis(): Promise<void> {
  try {
    await redis.connect();
  } catch (error) {
    logger.error('[Redis] Connection failed:', error);
    process.exit(1);
  }
}
