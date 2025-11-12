import admin from 'firebase-admin';
import { Notification } from '../models/Notification.model';
import { Device } from '../models/Device.model';
import { logger } from '../utils/logger';

export class PushService {
  private fcm: admin.messaging.Messaging;
  
  constructor() {
    if (process.env.FIREBASE_CREDENTIALS) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      
      this.fcm = admin.messaging();
      logger.info('[Push] Firebase initialized');
    } else {
      logger.warn('[Push] Firebase credentials not found - push disabled');
    }
  }
  
  /**
   * Send push notification
   */
  async send(notificationId: string): Promise<void> {
    if (!this.fcm) {
      logger.warn('[Push] FCM not initialized');
      return;
    }
    
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      logger.warn(`[Push] Notification ${notificationId} not found`);
      return;
    }
    
    // Get user devices
    const devices = await Device.find({ 
      userId: notification.userId,
      isActive: true
    });
    
    if (devices.length === 0) {
      logger.debug(`[Push] No devices for user ${notification.userId}`);
      await Notification.updateOne(
        { _id: notificationId },
        { 'deliveryStatus.push': 'sent' }
      );
      return;
    }
    
    const tokens = devices.map(d => d.token);
    
    try {
      const response = await this.fcm.sendMulticast({
        tokens,
        notification: {
          title: notification.title,
          body: notification.message
        },
        data: {
          type: notification.type,
          relatedId: notification.relatedId || '',
          relatedUrl: notification.relatedUrl || ''
        },
        webpush: notification.relatedUrl ? {
          fcmOptions: {
            link: `https://seedfinderpro.de${notification.relatedUrl}`
          }
        } : undefined
      });
      
      // Handle failed tokens
      if (response.failureCount > 0) {
        const failedTokens = response.responses
          .map((r, i) => r.success ? null : tokens[i])
          .filter(Boolean) as string[];
        
        await Device.updateMany(
          { token: { $in: failedTokens } },
          { isActive: false }
        );
        
        logger.warn(`[Push] ${failedTokens.length} tokens failed`);
      }
      
      await Notification.updateOne(
        { _id: notificationId },
        { 'deliveryStatus.push': 'sent' }
      );
      
      logger.info(`[Push] Sent to ${response.successCount}/${tokens.length} devices`);
      
    } catch (error) {
      logger.error('[Push] Send failed:', error);
      
      await Notification.updateOne(
        { _id: notificationId },
        { 'deliveryStatus.push': 'failed' }
      );
    }
  }
  
  /**
   * Register device token
   */
  async registerDevice(userId: string, data: {
    token: string;
    platform: 'ios' | 'android' | 'web';
    deviceName?: string;
    appVersion?: string;
    osVersion?: string;
  }): Promise<void> {
    await Device.findOneAndUpdate(
      { token: data.token },
      {
        userId,
        ...data,
        isActive: true,
        lastUsedAt: new Date()
      },
      { upsert: true }
    );
    
    logger.info(`[Push] Device registered for user ${userId}`);
  }
  
  /**
   * Unregister device
   */
  async unregisterDevice(token: string): Promise<void> {
    await Device.deleteOne({ token });
    logger.info(`[Push] Device unregistered`);
  }
}

export const pushService = new PushService();