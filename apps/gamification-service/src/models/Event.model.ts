// /apps/gamification-service/src/models/Event.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  userId: string;
  type: string;              // 'grow:created', 'thread:created', etc.
  data: any;                 // Event-spezifische Daten
  
  // Processing
  processed: boolean;
  processedAt?: Date;
  
  // Rewards
  xpAwarded?: number;
  achievementsUnlocked?: string[];
  badgesAwarded?: string[];
  
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>({
  userId: { type: String, required: true, index: true },
  type: { type: String, required: true, index: true },
  data: { type: Schema.Types.Mixed, required: true },
  
  processed: { type: Boolean, default: false, index: true },
  processedAt: Date,
  
  xpAwarded: Number,
  achievementsUnlocked: [String],
  badgesAwarded: [String]
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Indexes
EventSchema.index({ userId: 1, createdAt: -1 });
EventSchema.index({ processed: 1, createdAt: 1 });
EventSchema.index({ type: 1 });

// TTL-Index (Events nach 90 Tagen löschen)
EventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 Tage

export const Event = mongoose.model<IEvent>('Event', EventSchema);
