import mongoose, { Schema, Document } from 'mongoose';

export interface IEntry extends Document {
  growId: string;
  userId: string;
  
  week: number;
  day?: number;
  
  title: string;
  notes?: string;
  
  height?: number;
  ph?: number;
  ec?: number;
  ppm?: number;
  temperature?: number;
  humidity?: number;
  vpd?: number;
  
  watered?: boolean;
  fed?: boolean;
  defoliated?: boolean;
  trained?: boolean;
  
  photoCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const EntrySchema = new Schema<IEntry>({
  growId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  
  week: { type: Number, required: true },
  day: Number,
  
  title: { type: String, required: true, maxlength: 200 },
  notes: { type: String, maxlength: 5000 },
  
  height: Number,
  ph: Number,
  ec: Number,
  ppm: Number,
  temperature: Number,
  humidity: Number,
  vpd: Number,
  
  watered: Boolean,
  fed: Boolean,
  defoliated: Boolean,
  trained: Boolean,
  
  photoCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

EntrySchema.index({ growId: 1, week: 1, day: 1 });
EntrySchema.index({ userId: 1, createdAt: -1 });

EntrySchema.virtual('photos', {
  ref: 'Photo',
  localField: '_id',
  foreignField: 'entryId'
});

EntrySchema.pre('save', function(next) {
  if (this.temperature && this.humidity) {
    const svp = 0.61078 * Math.exp((17.27 * this.temperature) / (this.temperature + 237.3));
    const vpd = svp * (1 - this.humidity / 100);
    this.vpd = parseFloat(vpd.toFixed(2));
  }
  next();
});

export const Entry = mongoose.model<IEntry>('Entry', EntrySchema);
