import { Schema, model } from 'mongoose';
import { IPermission } from '@/types/models.js';

const permissionSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      require: true,
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
      require: true,
    },
    startDate: {
      type: Date,
      require: true,
    },
    endDate: {
      type: Date,
      require: true,
    },
    reason: {
      type: String,
      trim: true,
      require: true,
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
