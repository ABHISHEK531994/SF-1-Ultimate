// Price Service - Price Alert Model
import mongoose, { Schema, Document } from 'mongoose';

export interface IPriceAlert extends Document {
  userId: string;
  
  // Target
  seedId: mongoose.Types.ObjectId;
  seedSlug: string;
  
  // Trigger
  targetPrice: number;
  currency: string;
  
  // Options
  seedbanks?: string[];
  packSize?: string;
  notifyOnDiscount: boolean;
  notifyOnRestock: boolean;
  
  // Status
  isActive: boolean;
  triggeredAt?: Date;
  triggeredPrice?: number;
  triggeredSeedbank?: string;
  
  // Notifications
  lastNotified?: Date;
  notificationCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const PriceAlertSchema = new Schema<IPriceAlert>({
  userId: { type: String, required: true, index: true },
  
  seedId: {
    type: Schema.Types.ObjectId,
    ref: 'Seed',
    required: true,
    index: true
  },
  seedSlug: { type: String, required: true },
  
  targetPrice: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'EUR' },
  
  seedbanks: [String],
  packSize: String,
  notifyOnDiscount: { type: Boolean, default: true },
  notifyOnRestock: { type: Boolean, default: false },
  
  isActive: { type: Boolean, default: true, index: true },
  triggeredAt: Date,
  triggeredPrice: Number,
  triggeredSeedbank: String,
  
  lastNotified: Date,
  notificationCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Indexes
PriceAlertSchema.index({ userId: 1, seedId: 1 });
PriceAlertSchema.index({ isActive: 1, targetPrice: 1 });

export const PriceAlert = mongoose.model<IPriceAlert>('PriceAlert', PriceAlertSchema);
