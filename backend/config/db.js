const mongoose = require('mongoose');

// Global cache for serverless environments
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB Database with global caching for serverless
 * Prevents buffering timeouts on Vercel
 */
const connectDB = async () => {
  // Return cached connection if available
  if (cached.conn) {
    console.log('✅ Using cached MongoDB connection');
    return cached.conn;
  }

  // If no promise exists, create a new connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering to prevent timeouts
    };

    console.log('🔄 Creating new MongoDB connection...');
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => {
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
        console.log(`📊 Database Name: ${mongoose.connection.name}`);
        return mongoose;
      })
      .catch((error) => {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        cached.promise = null; // Reset promise on error
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Reset on error
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;
