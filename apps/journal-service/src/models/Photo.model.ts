import mongoose, { Schema, Document } from 'mongoose';

export interface IPhoto extends Document {
  entryId: string;
  growId: string;
  userId: string;
  
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  
  url: string;
  thumbnailUrl: string;
  mediumUrl: string;
  
  width: number;
  height: number;
  
  takenAt?: Date;
  
  order: number;
  caption?: string;
  isBlurred: boolean;
  
  createdAt: Date;
}

const PhotoSchema = new Schema<IPhoto>({
  entryId: { type: String, required: true, index: true },
  growId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  
  filename: { type: String, required: true },
  originalFilename: String,
  mimeType: String,
  size: Number,
  
  url: { type: String, required: true },
  thumbnailUrl: String,
  mediumUrl: String,
  
  width: Number,
  height: Number,
  
  takenAt: Date,
  
  order: { type: Number, default: 0 },
  caption: { type: String, maxlength: 500 },
  isBlurred: { type: Boolean, default: false },
}, {
  timestamps: true
});

PhotoSchema.index({ entryId: 1, order: 1 });
PhotoSchema.index({ growId: 1 });

export const Photo = mongoose.model<IPhoto>('Photo', PhotoSchema);
