// /apps/media-service/src/models/File.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IFile extends Document {
  userId: string;
  
  // Original File
  originalFilename: string;
  filename: string;          // Unique ID (nanoid)
  mimeType: string;
  size: number;              // Bytes
  
  // Storage
  storageKey: string;        // S3 Key
  bucket: string;
  
  // URLs
  url: string;               // Original
  thumbnailUrl?: string;     // 150x150
  smallUrl?: string;         // 300x300
  mediumUrl?: string;        // 800x800
  largeUrl?: string;         // 1200x1200
  
  // Metadata
  width?: number;
  height?: number;
  duration?: number;         // Video-Dauer (Sekunden)
  
  // Processing
  isProcessed: boolean;
  processingError?: string;
  
  // Classification
  fileType: 'image' | 'video' | 'document' | 'audio' | 'other';
  category?: string;         // 'avatar', 'journal', 'community', 'strain'
  
  // Security
  virusScanned: boolean;
  virusScanResult?: 'clean' | 'infected' | 'error';
  
  // Privacy
  exifStripped: boolean;
  
  // Usage
  linkedTo?: {
    type: string;            // 'grow', 'entry', 'thread', 'reply'
    id: string;
  }[];
  downloadCount: number;
  
  // Soft Delete
  deletedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const FileSchema = new Schema<IFile>({
  userId: { type: String, required: true, index: true },
  
  originalFilename: { type: String, required: true },
  filename: { type: String, required: true, unique: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  
  storageKey: { type: String, required: true },
  bucket: { type: String, required: true },
  
  url: { type: String, required: true },
  thumbnailUrl: String,
  smallUrl: String,
  mediumUrl: String,
  largeUrl: String,
  
  width: Number,
  height: Number,
  duration: Number,
  
  isProcessed: { type: Boolean, default: false },
  processingError: String,
  
  fileType: {
    type: String,
    enum: ['image', 'video', 'document', 'audio', 'other'],
    required: true
  },
  category: {
    type: String,
    enum: ['avatar', 'journal', 'community', 'strain'],
    index: true
  },
  
  virusScanned: { type: Boolean, default: false },
  virusScanResult: {
    type: String,
    enum: ['clean', 'infected', 'error']
  },
  
  exifStripped: { type: Boolean, default: false },
  
  linkedTo: [{
    type: { type: String, required: true },
    id: { type: String, required: true }
  }],
  downloadCount: { type: Number, default: 0 },
  
  deletedAt: Date
}, {
  timestamps: true
});

// Indexes
FileSchema.index({ userId: 1, createdAt: -1 });
FileSchema.index({ fileType: 1, category: 1 });
FileSchema.index({ virusScanned: 1, virusScanResult: 1 });
FileSchema.index({ deletedAt: 1 });
FileSchema.index({ 'linkedTo.type': 1, 'linkedTo.id': 1 });

// Virtuals
FileSchema.virtual('isImage').get(function() {
  return this.fileType === 'image';
});

FileSchema.virtual('isVideo').get(function() {
  return this.fileType === 'video';
});

FileSchema.virtual('sizeKB').get(function() {
  return Math.round(this.size / 1024);
});

FileSchema.virtual('sizeMB').get(function() {
  return (this.size / (1024 * 1024)).toFixed(2);
});

export const File = mongoose.model<IFile>('File', FileSchema);
