const mongoose = require('mongoose');

// Global cache for connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB Database with global caching
 */
const connectDB = async () => {
  // Return cached connection if available
  if (cached.conn) {
    console.log('✅ Using cached MongoDB connection');
    return cached.conn;
  }

  // If no promise exists, create a new connection
  if (!cached.promise) {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Increase timeout
      family: 4, // Use IPv4, skip trying IPv6
    };

    console.log('🔄 Connecting to MongoDB...');
    console.log('📍 URI:', process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials in logs
    
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => {
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
        console.log(`📊 Database: ${mongoose.connection.name}`);
        return mongoose;
      })
      .catch((error) => {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.error(`🔍 Error Code: ${error.code || 'UNKNOWN'}`);
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
