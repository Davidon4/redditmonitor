import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Define the type first
interface GlobalMongoose {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: GlobalMongoose | undefined;
}

const cached: GlobalMongoose = global.mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      family: 4,
      maxPoolSize: 10,
      connectTimeoutMS: 10000,
      dbName: 'reddimon',
      retryWrites: true,
      w: 'majority' as const
    };

    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts);
      const conn = await Promise.race([
        cached.promise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 10000)
        )
      ]) as typeof mongoose;
      cached.conn = conn;
      return cached.conn;
    } catch (error) {
      cached.promise = null;
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  return cached.conn;
}