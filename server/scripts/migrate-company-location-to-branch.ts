import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Company from '../src/db/models/company.js';
import Branch from '../src/db/models/branch.js';

async function run() {
  const uri = process.env.DB_URI;
  if (!uri) throw new Error('DB_URI missing');
  await mongoose.connect(uri);
  const companies = await Company.find({ 'location.lat': { $exists: true } });
  let created = 0;
  for (const c of companies) {
    const exists = await Branch.findOne({ company: c._id, name: 'Sede principal' });
    if (exists) continue;
    const loc: any = (c as any).location;
    if (loc?.lat == null || loc?.lng == null) continue;
    await Branch.create({
      name: 'Sede principal',
      address: 'Migrado desde empresa',
      location: { lat: loc.lat, lng: loc.lng },
      geofenceRadius: (c as any).geofenceRadius || 200,
      company: c._id,
    });
    created++;
    console.log(`Branch creada para ${c.name}`);
  }
  console.log(`Migración completa: ${created} sucursales creadas de ${companies.length} empresas`);
  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
