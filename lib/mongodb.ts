import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const MONGODB_URI = process.env.MONGODB_URI;

let cachedConnection = global.mongoose;

if (!cachedConnection) {
  cachedConnection = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cachedConnection.conn) {
    console.log("Using existing MongoDB connection");
    return cachedConnection.conn;
  }

  if (!cachedConnection.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log("Creating new MongoDB connection");
    cachedConnection.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("New MongoDB connection created");
        return mongoose;
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        throw error;
      });
  }

  try {
    cachedConnection.conn = await cachedConnection.promise;
    return cachedConnection.conn;
  } catch (error) {
    cachedConnection.promise = null;
    throw error;
  }
}

export default dbConnect;

