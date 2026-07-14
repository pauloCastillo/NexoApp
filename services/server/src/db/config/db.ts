import mongoose from 'mongoose';
import logger from '@/utils/logger.js';

async function dbConnection() {
  try {
    console.log(process.env.DB_URI);
    const db = await mongoose.connect(process.env.DB_URI!, {
      dbName: "NexoDB",
      minPoolSize: 50,
      family: 4,
    });
    logger.info({ name: db.connection.name }, 'Database connected');
  } catch (error: any) {
    logger.error({ err: error }, 'Database connection failed');
  }
}

export default dbConnection;
