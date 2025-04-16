import mongoose, { Connection, Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Define our mongoose cache type
interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Mongoose> | null;
}

// Create a simple interface for the global with mongoose property
interface CustomGlobal {
  mongoose?: MongooseCache;
}

// Use a type assertion for the global
const globalWithMongoose = global as unknown as CustomGlobal;

// Initialize cache using existing global or create new
const cached: MongooseCache = globalWithMongoose.mongoose || { conn: null, promise: null };

// Store back in global
globalWithMongoose.mongoose = cached;

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = (await cached.promise).connection;
  return cached.conn;
}