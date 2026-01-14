import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Check if already connected (reuse connection on serverless)
    if (mongoose.connections[0].readyState === 1) {
      console.log('✅ MongoDB Already Connected');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Don't use process.exit() on serverless - just throw
    throw new Error(`Database connection failed: ${error.message}`);
  }
};

export default connectDB;
