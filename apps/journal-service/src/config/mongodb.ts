import mongoose from 'mongoose';

const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/sf1-journal';

export async function connectMongoDB() {
  await mongoose.connect(mongoUrl);
  console.log('✅ MongoDB connected');
}
