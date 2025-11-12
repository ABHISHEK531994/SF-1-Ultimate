// /apps/community-service/src/models/Vote.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IVote extends Document {
  userId: string;
  targetId: string;
  targetType: 'thread' | 'reply';
  type: 'upvote' | 'downvote';
  createdAt: Date;
}

const VoteSchema = new Schema<IVote>({
  userId: { 
    type: String, 
    required: true,
    index: true
  },
  targetId: { 
    type: String, 
    required: true,
    index: true
  },
  targetType: { 
    type: String, 
    enum: ['thread', 'reply'],
    required: true
  },
  type: { 
    type: String, 
    enum: ['upvote', 'downvote'],
    required: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Unique: Ein User kann nur 1x pro Target voten
VoteSchema.index({ userId: 1, targetId: 1 }, { unique: true });

// Compound Indexes
VoteSchema.index({ targetId: 1, targetType: 1 });
VoteSchema.index({ userId: 1, type: 1, createdAt: -1 });

export const Vote = mongoose.model<IVote>('Vote', VoteSchema);
