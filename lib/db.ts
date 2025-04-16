import mongoose, { Connection, Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

declare global {
  namespace NodeJS {
    interface Global {
      mongoose: {
        conn: Connection | null;
        promise: Promise<Mongoose> | null;
      };
    }
  }

  var mongoose: {
    conn: Connection | null;
    promise: Promise<Mongoose> | null;
  };
}

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
