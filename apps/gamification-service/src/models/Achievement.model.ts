// /apps/gamification-service/src/models/Achievement.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  id: string;                // Unique ID (slug)
  name: string;
  description: string;
  icon: string;              // Emoji oder Icon-Name
  category: 'grow' | 'social' | 'community' | 'milestone' | 'special';
  
  // Rewards
  xpReward: number;
  badgeId?: string;          // Optional Badge
  
  // Requirements
  requirement: {
    type: string;            // 'grow_count', 'harvest_count', 'yield_total', etc.
    value: number;
  };
  
  // Rarity
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  
  // Stats
  unlockedCount: number;     // Wie oft wurde es freigeschaltet
  
  isActive: boolean;
  
  createdAt: Date;
}

const AchievementSchema = new Schema<IAchievement>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  category: {
    type: String,
    enum: ['grow', 'social', 'community', 'milestone', 'special'],
    required: true
  },
  
  xpReward: { type: Number, required: true },
  badgeId: String,
  
  requirement: {
    type: { type: String, required: true },
    value: { type: Number, required: true }
  },
  
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  
  unlockedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Indexes
AchievementSchema.index({ category: 1 });
AchievementSchema.index({ rarity: 1 });

export const Achievement = mongoose.model<IAchievement>('Achievement', AchievementSchema);
