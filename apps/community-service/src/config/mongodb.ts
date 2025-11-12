// /apps/community-service/src/config/mongodb.ts
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export async function connectMongoDB(): Promise<void> {
  const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/sf1-community';
  
  try {
    await mongoose.connect(mongoUrl);
    logger.info('[MongoDB] Connected successfully');
  } catch (error) {
    logger.error('[MongoDB] Connection failed:', error);
    throw error;
  }
}

mongoose.connection.on('error', (error) => {
  logger.error('[MongoDB] Error:', error);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('[MongoDB] Disconnected');
});
