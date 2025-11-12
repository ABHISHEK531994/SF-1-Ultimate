// /apps/media-service/src/services/quota.service.ts
import { Quota } from '../models/Quota.model';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export class QuotaService {
  /**
   * Quota abrufen oder erstellen
   */
  async getOrCreate(userId: string, isPremium: boolean = false): Promise<any> {
    return Quota.getOrCreate(userId, isPremium);
  }
  
  /**
   * Quota prüfen (vor Upload)
   */
  async checkQuota(userId: string, fileSize: number, isPremium: boolean = false): Promise<void> {
    const quota = await this.getOrCreate(userId, isPremium);
    
    const fileSizeMB = fileSize / (1024 * 1024);
    
    // Check: Storage-Limit
    if (quota.usedMB + fileSizeMB > quota.uploadLimitMB) {
      throw new AppError('QUOTA_EXCEEDED', 403, 
        `Storage quota exceeded. Used: ${quota.usedMB} MB / ${quota.uploadLimitMB} MB`
      );
    }
    
    // Check: File-Count-Limit
    if (quota.fileCount + 1 > quota.fileCountLimit) {
      throw new AppError('QUOTA_EXCEEDED', 403, 
        `File count limit exceeded. Used: ${quota.fileCount} / ${quota.fileCountLimit}`
      );
    }
    
    logger.debug(`[Quota] Check passed for user ${userId}: ${fileSizeMB.toFixed(2)} MB`);
  }
  
  /**
   * Quota erhöhen (nach Upload)
   */
  async incrementUsage(userId: string, fileSize: number): Promise<void> {
    const sizeMB = fileSize / (1024 * 1024);
    await Quota.incrementUsage(userId, sizeMB);
    
    logger.debug(`[Quota] Incremented for user ${userId}: +${sizeMB.toFixed(2)} MB`);
  }
  
  /**
   * Quota reduzieren (nach Delete)
   */
  async decrementUsage(userId: string, fileSize: number): Promise<void> {
    const sizeMB = fileSize / (1024 * 1024);
    await Quota.decrementUsage(userId, sizeMB);
    
    logger.debug(`[Quota] Decremented for user ${userId}: -${sizeMB.toFixed(2)} MB`);
  }
  
  /**
   * Quota upgraden (FREE → PREMIUM)
   */
  async upgradeToPremium(userId: string): Promise<void> {
    await Quota.updateOne(
      { userId },
      {
        $set: {
          uploadLimitMB: 5000,
          fileCountLimit: 10000
        }
      }
    );
    
    logger.info(`[Quota] Upgraded to Premium: ${userId}`);
  }
  
  /**
   * Quota downgraden (PREMIUM → FREE)
   */
  async downgradeToFree(userId: string): Promise<void> {
    await Quota.updateOne(
      { userId },
      {
        $set: {
          uploadLimitMB: 500,
          fileCountLimit: 1000
        }
      }
    );
    
    logger.info(`[Quota] Downgraded to Free: ${userId}`);
  }
  
  /**
   * Monatlicher Reset (Cron-Job)
   */
  async resetAllQuotas(): Promise<void> {
    const result = await Quota.resetMonthly();
    
    logger.info(`[Quota] Monthly reset: ${result.modifiedCount} quotas reset`);
  }
  
  /**
   * Stats abrufen
   */
  async getStats(userId: string): Promise<any> {
    const quota = await Quota.findOne({ userId });
    
    if (!quota) {
      return null;
    }
    
    return {
      usedMB: quota.usedMB,
      limitMB: quota.uploadLimitMB,
      remainingMB: quota.remainingMB,
      usagePercent: quota.usagePercent,
      fileCount: quota.fileCount,
      fileCountLimit: quota.fileCountLimit,
      remainingFiles: quota.remainingFiles,
      lastResetAt: quota.lastResetAt,
      isQuotaExceeded: quota.isQuotaExceeded
    };
  }
}

export const quotaService = new QuotaService();
