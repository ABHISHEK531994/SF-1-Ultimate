// /apps/gamification-service/src/models/Badge.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IBadge extends Document {
  id: string;                // Unique ID (slug)
  name: string;
  description: string;
  icon: string;              // Emoji oder Icon-Name
  color: string;             // Hex-Color
  
  // Type
  type: 'achievement' | 'special' | 'event' | 'premium';
  
  // Rarity
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  
  // Stats
  ownersCount: number;       // Wie viele User haben das Badge
  
  isActive: boolean;
  
  createdAt: Date;
}

const BadgeSchema = new Schema<IBadge>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  
  type: {
    type: String,
    enum: ['achievement', 'special', 'event', 'premium'],
    required: true
  },
  
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  
  ownersCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Indexes
BadgeSchema.index({ type: 1 });
BadgeSchema.index({ rarity: 1 });

export const Badge = mongoose.model<IBadge>('Badge', BadgeSchema);
