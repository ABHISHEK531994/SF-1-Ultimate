import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export async function connectMongoDB(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/sf1-notifications');
    logger.info('[MongoDB] Connected');
  } catch (error) {
    logger.error('[MongoDB] Connection failed:', error);
    throw error;
  }
}