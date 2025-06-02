import mongoose from 'mongoose';

const connectToMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL || "mongodb+srv://jeeturadicalloop:Mjvesqnj8gY3t0zP@cluster0.by2xy6x.mongodb.net/FarmerEcommerce";
    
    if (!mongoUrl) {
      throw new Error("MONGODB_URL must be set. Please provide your MongoDB connection string.");
    }
    
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

export { connectToMongoDB };
export const db = mongoose;