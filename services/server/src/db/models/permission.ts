import { Schema, model } from 'mongoose';
import { IPermission } from '@/types/models.js';

const permissionSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    type: {
      type: String,
      enum: ["permiso", "licencia", "otro"],
      default: "permiso",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["pendiente", "aprobado", "rechazado"],
      default: "pendiente",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Permission = model<IPermission>("Permission", permissionSchema, "permissions");
export default Permission;
