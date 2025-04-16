import mongoose, { Connection, Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Extend the global object to safely cache the connection
declare global {
  // Allow global.mongoose to exist for caching
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Mongoose> | null;
  } | undefined;
}

// Use the global object for cache (no `any` used here)
const cached = global.mongoose ?? (global.mongoose = { conn: null, promise: null });

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
