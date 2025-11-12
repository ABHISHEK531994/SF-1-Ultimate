// /apps/search-service/src/workers/sync.worker.ts
import Bull from 'bull';
import { indexingService } from '../services/indexing.service';
import { logger } from '../utils/logger';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

/**
 * Queue für Index-Updates
 */
const syncQueue = new Bull('search-sync', REDIS_URL, {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});

/**
 * Job-Types
 */
export interface SyncJob {
  type: 'index' | 'update' | 'delete';
  index: 'STRAINS' | 'THREADS' | 'GROWS' | 'USERS';
  documentId?: string;
  document?: any;
}

/**
 * Worker-Processing
 */
syncQueue.process(async (job) => {
  const { type, index, documentId, document } = job.data as SyncJob;
  
  logger.debug(`[Sync] Processing ${type} for ${index}:${documentId || 'bulk'}`);
  
  try {
    switch (type) {
      case 'index':
        if (document) {
          await indexingService.indexDocument(index, document);
        }
        break;
        
      case 'update':
        if (document) {
          await indexingService.updateDocument(index, document);
        }
        break;
        
      case 'delete':
        if (documentId) {
          await indexingService.deleteDocument(index, documentId);
        }
        break;
    }
    
    logger.info(`[Sync] Successfully processed ${type} for ${index}`);
  } catch (error) {
    logger.error(`[Sync] Failed to process ${type}:`, error);
    throw error;
  }
});

/**
 * Event-Handler
 */
syncQueue.on('completed', (job) => {
  logger.debug(`[Sync] Job ${job.id} completed`);
});

syncQueue.on('failed', (job, err) => {
  logger.error(`[Sync] Job ${job?.id} failed:`, err);
});

/**
 * Queue-Helper-Functions
 */
export const syncWorker = {
  /**
   * Dokument indexieren (async)
   */
  async queueIndex(index: SyncJob['index'], document: any): Promise<void> {
    await syncQueue.add({
      type: 'index',
      index,
      document
    });
  },
  
  /**
   * Dokument aktualisieren (async)
   */
  async queueUpdate(index: SyncJob['index'], document: any): Promise<void> {
    await syncQueue.add({
      type: 'update',
      index,
      document
    });
  },
  
  /**
   * Dokument löschen (async)
   */
  async queueDelete(index: SyncJob['index'], documentId: string): Promise<void> {
    await syncQueue.add({
      type: 'delete',
      index,
      documentId
    });
  },
  
  /**
   * Queue-Status
   */
  async getStats(): Promise<any> {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      syncQueue.getWaitingCount(),
      syncQueue.getActiveCount(),
      syncQueue.getCompletedCount(),
      syncQueue.getFailedCount(),
      syncQueue.getDelayedCount()
    ]);
    
    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + delayed
    };
  }
};
