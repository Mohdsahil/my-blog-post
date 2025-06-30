import mongoose from 'mongoose';

let cachedConnection: Promise<typeof mongoose> | null = null;


async function connectDB(): Promise<typeof mongoose> {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  // Attempt to connect to MongoDB
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully!');
    cachedConnection = Promise.resolve(connection);
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    cachedConnection = null;
    throw new Error('Failed to connect to MongoDB');
  }
}

export default connectDB;
