import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  
  type: 'comment' | 'reply' | 'reaction' | 'follow' | 'mention' | 'price_alert' | 'milestone' | 'badge' | 'system';
  
  title: string;
  message: string;
  
  // Context
  relatedId?: string;
  relatedType?: string;
  relatedUrl?: string;
  
  // Metadata
  data?: Record<string, any>;
  
  // Status
  isRead: boolean;
  readAt?: Date;
  
  // Delivery
  channels: ('in_app' | 'email' | 'push')[];
  deliveryStatus: {
    in_app: boolean;
    email?: 'pending' | 'sent' | 'failed';
    push?: 'pending' | 'sent' | 'failed';
  };
  
  // Grouping
  groupKey?: string;
  
  createdAt: Date;
  expiresAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: String, required: true, index: true },
  
  type: {
    type: String,
    required: true,
    enum: ['comment', 'reply', 'reaction', 'follow', 'mention', 'price_alert', 'milestone', 'badge', 'system']
  },
  
  title: { type: String, required: true, maxlength: 200 },
  message: { type: String, required: true, maxlength: 1000 },
  
  relatedId: String,
  relatedType: String,
  relatedUrl: String,
  
  data: Schema.Types.Mixed,
  
  isRead: { type: Boolean, default: false, index: true },
  readAt: Date,
  
  channels: [{ type: String, enum: ['in_app', 'email', 'push'] }],
  deliveryStatus: {
    in_app: { type: Boolean, default: true },
    email: { type: String, enum: ['pending', 'sent', 'failed'] },
    push: { type: String, enum: ['pending', 'sent', 'failed'] }
  },
  
  groupKey: String,
  
  expiresAt: { type: Date, required: true }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Indexes
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, type: 1 });
NotificationSchema.index({ groupKey: 1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);