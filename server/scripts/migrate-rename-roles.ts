import mongoose from 'mongoose';
import { User } from '@/db/models/index.js';

const mappings: Record<string, string> = {
  manager: 'supervisor',
  editor: 'hr_manager',
  hr: 'hr_manager',
  viewer: 'employee',
  it: 'support',
  owner: 'business_owner',
};

async function migrate() {
  const uri = process.env.DB_URI;
  if (!uri) {
    console.error('DB_URI environment variable is required');
    process.exit(1);
  }
  await mongoose.connect(uri, { dbName: 'NexoDB' });
  console.log('Connected to MongoDB (NexoDB)');
  for (const [from, to] of Object.entries(mappings)) {
    const r = await User.updateMany({ role: from }, { $set: { role: to } });
    if (r.modifiedCount) console.log(`  ${from} -> ${to}: ${r.modifiedCount}`);
  }
  // Ensure no legacy roles remain
  const leftover = await User.find({ role: { $in: Object.keys(mappings) } }).select('role').lean();
  if (leftover.length) console.warn(`Leftover legacy roles: ${leftover.length}`);
  else console.log('Migration complete — no legacy roles');
  await mongoose.disconnect();
}
migrate().catch((e) => { console.error(e); process.exit(1); });
