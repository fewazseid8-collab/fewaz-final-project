import mongoose from 'mongoose';

const connectDB = async (options = {}) => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  const maxRetries = options.maxRetries || 5;
  const baseDelay = options.baseDelay || 2000; // ms

  if (!uri || uri === 'undefined') {
    const msg = `MongoDB connection string is missing or invalid: ${uri}`;
    console.error(msg);
    throw new Error('MongoDB connection string not provided (MONGODB_URI or MONGO_URI)');
  }

  let attempt = 0;
  const tryConnect = async () => {
    attempt += 1;
    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected');
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${attempt} failed:`, err && err.message ? err.message : err);
      if (attempt >= maxRetries) {
        console.error(`MongoDB connection failed after ${attempt} attempts.`);
        throw err;
      }
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Retrying MongoDB connection in ${delay} ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return tryConnect();
    }
  };

  return tryConnect();
};

export default connectDB;
