import mongoose from 'mongoose';
import { Company, Employee, Client, ControlTime, Location, ManagerModel, Permission, Vacation, WorkOrder } from '@/db/models/index.js';

async function migrate() {
  const uri = process.env.DB_URI;
  if (!uri) {
    console.error('DB_URI environment variable is required');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const existingCompany = await Company.findOne();
  if (existingCompany) {
    console.log('Migration already applied (companies exist), skipping');
    await mongoose.disconnect();
    return;
  }

  const company = await Company.create({ name: 'Default Company' });
  console.log('Created default company:', company._id, 'inviteCode:', company.inviteCode);

  const updateOps = [
    { model: Employee, name: 'Employee' },
    { model: Client, name: 'Client' },
    { model: ControlTime, name: 'ControlTime' },
    { model: Location, name: 'Location' },
    { model: Permission, name: 'Permission' },
    { model: Vacation, name: 'Vacation' },
    { model: WorkOrder, name: 'WorkOrder' },
  ];

  for (const { model, name } of updateOps) {
    const result = await model.updateMany(
      { company: { $exists: false } },
      { $set: { company: company._id } }
    );
    console.log(`Updated ${name}: ${result.modifiedCount} documents`);
  }

  const managerResult = await ManagerModel.updateMany(
    { company: { $exists: false } },
    { $set: { company: company._id } }
  );
  console.log(`Updated Manager: ${managerResult.modifiedCount} documents`);

  console.log('Migration complete');
  console.log('Invite code for registration:', company.inviteCode);
  console.log('Use this code when registering new employees');

  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
