import mongoose from 'mongoose';
import { User } from '@/db/models/index.js';

async function migrate() {
  const uri = process.env.DB_URI;
  if (!uri) {
    console.error('DB_URI environment variable is required');
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName: "NexoDB" });
  console.log('Connected to MongoDB (NexoDB)');

  const result = await User.updateMany(
    { role: 'owner' },
    { $set: { role: 'business_owner' } }
  );
  console.log(`Renamed role 'owner' -> 'business_owner' in ${result.modifiedCount} user(s)`);

  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
