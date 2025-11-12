// /apps/community-service/src/models/Report.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  reporterId: string;
  targetId: string;
  targetType: 'thread' | 'reply';
  targetOwnerId: string;
  
  reason: 'spam' | 'abuse' | 'harassment' | 'illegal' | 'misinformation' | 'other';
  description?: string;
  
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  
  reviewerId?: string;
  reviewedAt?: Date;
  reviewNote?: string;
  
  actionTaken?: 'none' | 'warning' | 'content_removed' | 'user_banned';
  
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>({
  reporterId: { 
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
  targetOwnerId: { 
    type: String, 
    required: true,
    index: true
  },
  
  reason: { 
    type: String, 
    enum: ['spam', 'abuse', 'harassment', 'illegal', 'misinformation', 'other'],
    required: true
  },
  description: { 
    type: String, 
    maxlength: 1000 
  },
  
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending',
    index: true
  },
  
  reviewerId: { 
    type: String,
    index: true
  },
  reviewedAt: Date,
  reviewNote: { 
    type: String, 
    maxlength: 1000 
  },
  
  actionTaken: { 
    type: String, 
    enum: ['none', 'warning', 'content_removed', 'user_banned']
  }
}, {
  timestamps: true
});

// Indexes
ReportSchema.index({ status: 1, createdAt: -1 });
ReportSchema.index({ targetId: 1, targetType: 1 });
ReportSchema.index({ reporterId: 1, createdAt: -1 });

export const Report = mongoose.model<IReport>('Report', ReportSchema);
