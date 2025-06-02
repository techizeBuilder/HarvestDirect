import mongoose from 'mongoose';

if (!process.env.MONGODB_URL) {
  throw new Error(
    "MONGODB_URL must be set. Please provide your MongoDB connection string.",
  );
}

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL!);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

export { connectToMongoDB };
export const db = mongoose;