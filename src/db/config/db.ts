import mongoose from 'mongoose';

async function dbConnection() {
  try {
    const db = await mongoose.connect(process.env.DB_URI!, {
      dbName: "NexoDB",
      minPoolSize: 50,
      family: 4,
    });
    console.log(`Successfully Connection with ${db.connection.name}`);
  } catch (error: any) {
    console.log(error.message);
  }
}

export default dbConnection;
