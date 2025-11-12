import mongoose, { Schema, Document } from 'mongoose';

export interface ICalculation extends Document {
  userId: string;
  type: string;
  input: any;
  result: any;
  isFavorite: boolean;
  createdAt: Date;
}

const CalculationSchema = new Schema<ICalculation>({
  userId: { type: String, required: true, index: true },
  type: { 
    type: String, 
    required: true,
    enum: ['vpd', 'ec_ppm', 'dli', 'ppfd', 'power_cost', 'co2']
  },
  input: { type: Schema.Types.Mixed, required: true },
  result: { type: Schema.Types.Mixed, required: true },
  isFavorite: { type: Boolean, default: false }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

CalculationSchema.index({ userId: 1, type: 1, createdAt: -1 });
CalculationSchema.index({ userId: 1, isFavorite: 1 });

export const Calculation = mongoose.model<ICalculation>('Calculation', CalculationSchema);
