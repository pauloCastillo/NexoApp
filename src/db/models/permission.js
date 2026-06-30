import {  Schema, model  } from 'mongoose';

const permissionSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      require: true,
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

const Permission = model("Permission", permissionSchema, "permissions");
export default Permission;
