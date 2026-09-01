import { Schema, model } from 'mongoose';
import { IBranch } from '@/types/models.js';

const branchSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    geofenceRadius: { type: Number, default: 200, min: 50, max: 2000 },
    geofenceType: { type: String, enum: ['circle'], default: 'circle' },
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, versionKey: false }
);

branchSchema.index({ company: 1, name: 1 }, { unique: true });

const Branch = model<IBranch>('Branch', branchSchema, 'branches');
export default Branch;
