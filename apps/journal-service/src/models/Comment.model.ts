import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  userId: string;
  growId: string;
  parentId?: string;
  
  content: string;
  
  likeCount: number;
  
  isEdited: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  userId: { type: String, required: true, index: true },
  growId: { type: String, required: true, index: true },
  parentId: { type: String, index: true },
  
  content: { 
    type: String, 
    required: true,
    minlength: 1,
    maxlength: 2000
  },
  
  likeCount: { type: Number, default: 0 },
  
  isEdited: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date
}, {
  timestamps: true
});

CommentSchema.index({ growId: 1, createdAt: -1 });
CommentSchema.index({ userId: 1, createdAt: -1 });
CommentSchema.index({ parentId: 1 });

CommentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentId'
});

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
