import { Calculation } from '../models/Calculation.model';
import { redis } from '../config/redis';
import { logger } from '../utils/logger';

export class CalculatorService {
  async saveCalculation(data: {
    userId: string;
    type: string;
    input: any;
    result: any;
  }): Promise<void> {
    try {
      const calculation = new Calculation({
        userId: data.userId,
        type: data.type,
        input: data.input,
        result: data.result
      });
      
      await calculation.save();
      
      await redis.del(`calculations:${data.userId}`);
      
      logger.debug(`[Calculator] Saved ${data.type} for user ${data.userId}`);
    } catch (error) {
      logger.error('[Calculator] Save failed:', error);
    }
  }
  
  async getHistory(userId: string, options: {
    type?: string;
    limit?: number;
    skip?: number;
  } = {}): Promise<{ calculations: any[]; total: number }> {
    const query: any = { userId };
    
    if (options.type) {
      query.type = options.type;
    }
    
    const limit = Math.min(options.limit || 50, 200);
    const skip = options.skip || 0;
    
    const [calculations, total] = await Promise.all([
      Calculation.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Calculation.countDocuments(query)
    ]);
    
    return { calculations, total };
  }
  
  async getMostUsed(userId: string): Promise<any[]> {
    return Calculation.aggregate([
      { $match: { userId } },
      { $group: {
        _id: '$type',
        count: { $sum: 1 },
        lastUsed: { $max: '$createdAt' }
      }},
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
  }
  
  async getFavorites(userId: string): Promise<any[]> {
    return Calculation.find({
      userId,
      isFavorite: true
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
  }
  
  async toggleFavorite(calculationId: string, userId: string): Promise<void> {
    const calculation = await Calculation.findOne({ _id: calculationId, userId });
    
    if (calculation) {
      calculation.isFavorite = !calculation.isFavorite;
      await calculation.save();
    }
  }
}

export const calculatorService = new CalculatorService();
