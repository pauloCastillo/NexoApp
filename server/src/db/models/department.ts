import { Schema, model } from 'mongoose';
import { IDepartment } from '@/types/models.js';

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

departmentSchema.index({ company: 1, name: 1 }, { unique: true });

const Department = model<IDepartment>('Department', departmentSchema, 'departments');
export default Department;
