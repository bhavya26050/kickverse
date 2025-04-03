import mongoose from "mongoose";

// Check for MongoDB URI
if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const MONGODB_URI = process.env.MONGODB_URI;

// Connection options to handle timeouts and retries
const options = {
  bufferCommands: false,
  maxIdleTimeMS: 10000,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 30000,
  connectTimeoutMS: 30000,
};

// Cache the connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Connect function with better error handling
async function dbConnect() {
  // If we already have a connection, use it
  if (cached.conn) {
    return cached.conn;
  }

  // If we're in the process of connecting, wait for it
  if (!cached.promise) {
    console.log("Creating new MongoDB connection to:", 
      MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@")); // Hide credentials in logs

    cached.promise = mongoose.connect(MONGODB_URI, options)
      .then((mongoose) => {
        console.log("MongoDB connected successfully!");
        return mongoose;
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        cached.promise = null; // Reset promise on error
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

export default dbConnect;

