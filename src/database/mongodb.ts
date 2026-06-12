import mongoose from 'mongoose';

let inMemoryServer: any | null = null;

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function startInMemoryMongo() {
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  inMemoryServer = await MongoMemoryServer.create();
  const uri = inMemoryServer.getUri();
  console.log('Started in-memory MongoDB at', uri);
  return uri;
}

export async function connectDatabase(
  uri?: string,
  maxAttempts = 5,
  baseDelayMs = 1000
) {
  // Prefer explicit param -> env -> default
  let raw = uri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mydb';

  const options: mongoose.ConnectOptions = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
  };

  // Attach connection event handlers for helpful logging and debugging
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected');
  });
  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('Mongoose disconnected');
  });

  // Helper to attempt connecting given a URI
  async function tryConnect(targetUri: string) {
    const mongoUri = String(targetUri).replace('localhost', '127.0.0.1');
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await mongoose.connect(mongoUri, options);
        console.log('Connected to MongoDB at', mongoUri);
        return mongoose.connection;
      } catch (err: any) {
        const msg = err?.message || err;
        console.error(`MongoDB connect attempt ${attempt} failed:`, msg);
        if (attempt === maxAttempts) throw err;

        // exponential backoff with jitter
        const backoff = baseDelayMs * 2 ** (attempt - 1);
        const jitter = Math.floor(Math.random() * baseDelayMs);
        const delay = backoff + jitter;
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  // If caller requested an in-memory DB explicitly, start it first
  if (process.env.USE_IN_MEMORY_MONGO === 'true') {
    try {
      raw = await startInMemoryMongo();
    } catch (err: any) {
      console.error('Failed to start in-memory MongoDB:', err?.message || err);
      throw err;
    }
    return tryConnect(raw);
  }

  // First try the provided or default URI
  try {
    return await tryConnect(raw);
  } catch (err: any) {
    console.error('Primary MongoDB connection failed:', err?.message || err);

    // If allowed, automatically fall back to an in-memory MongoDB instance
    const autoFallback = process.env.AUTO_IN_MEMORY_FALLBACK === 'true';
    if (autoFallback) {
      console.warn('AUTO_IN_MEMORY_FALLBACK=true — starting in-memory MongoDB fallback.');
      try {
        const memUri = await startInMemoryMongo();
        return await tryConnect(memUri);
      } catch (memErr: any) {
        console.error('In-memory MongoDB fallback failed:', memErr?.message || memErr);
        throw memErr;
      }
    }

    throw err;
  }
}

export async function disconnectDatabase() {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err: any) {
    console.error('Error during mongoose.disconnect():', err?.message || err);
  }

  if (inMemoryServer) {
    try {
      await inMemoryServer.stop();
      console.log('Stopped in-memory MongoDB');
      inMemoryServer = null;
    } catch (err: any) {
      console.error('Error stopping in-memory MongoDB:', err?.message || err);
    }
  }
}