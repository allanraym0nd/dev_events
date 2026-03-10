import mongoose from 'mongoose';

// MongoDB connection URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Define the shape of our cached connection
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Extend the Node.js global object to include our cache
declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: MongooseCache | undefined;
}

// Use a global variable to preserve the connection across hot reloads in development
const cached: MongooseCache = global.mongooseCache ?? {
    conn: null,
    promise: null,
};

if (!global.mongooseCache) {
    global.mongooseCache = cached;
}

/**
 * Connects to MongoDB and caches the connection.
 * In development, the cache is stored on the global object so that
 * the connection persists across Next.js hot module replacements.
 */
async function connectDB(): Promise<typeof mongoose> {
    // Return the cached connection if it's already established
    if (cached.conn) {
        return cached.conn;
    }

    // Start a new connection if one isn't already in progress
    if (!cached.promise) {
        if (!MONGODB_URI) {
            throw new Error(
                'MONGODB_URI is not defined. Please set it in your environment variables.'
            );
        }

        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false, // Fail fast instead of buffering when disconnected
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        // Reset the promise so the next call retries the connection
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

export default connectDB;
