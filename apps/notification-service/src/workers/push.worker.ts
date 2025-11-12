import { Queue, Worker } from 'bullmq';
import { redis } from '../config/redis';
import { pushService } from '../services/push.service';
import { logger } from '../utils/logger';

const pushQueue = new Queue('push', {
  connection: redis
});

const pushWorker = new Worker('push', async (job) => {
  const { notificationId } = job.data;
  
  logger.info(`[PushWorker] Processing ${notificationId}`);
  
  try {
    await pushService.send(notificationId);
    
    logger.info(`[PushWorker] Sent ${notificationId}`);
    
  } catch (error) {
    logger.error(`[PushWorker] Failed:`, error);
    throw error; // Retry
  }
}, {
  connection: redis,
  concurrency: 10
});

pushWorker.on('completed', (job) => {
  logger.debug(`[PushWorker] Job ${job.id} completed`);
});

pushWorker.on('failed', (job, err) => {
  logger.error(`[PushWorker] Job ${job?.id} failed:`, err);
});

export { pushQueue, pushWorker };