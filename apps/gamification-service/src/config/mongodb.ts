// /apps/gamification-service/src/config/mongodb.ts
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/sf1-gamification';

export async function connectMongoDB(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URL);
    logger.info('[MongoDB] Connected');
  } catch (error) {
    logger.error('[MongoDB] Connection failed:', error);
    process.exit(1);
  }
}
