// Price Service - MongoDB Configuration
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/sf1-prices';

export async function connectMongoDB(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URL, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    logger.info('[MongoDB] Connected successfully');
    
    mongoose.connection.on('error', (err) => {
      logger.error('[MongoDB] Connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('[MongoDB] Disconnected');
    });
    
  } catch (error) {
    logger.error('[MongoDB] Connection failed:', error);
    process.exit(1);
  }
}

export async function disconnectMongoDB(): Promise<void> {
  await mongoose.disconnect();
  logger.info('[MongoDB] Disconnected');
}
