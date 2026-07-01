import { Schema, model } from 'mongoose';
import { DateTime } from 'luxon';
import { IWorkOrder } from '@/types/models.js';

const workOrderSchema = new Schema(
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
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
    clientName: {
      type: String,
      trim: true,
    },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: () => DateTime.now().setZone("America/La_Paz").toISO(),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const WorkOrder = model<IWorkOrder>("WorkOrder", workOrderSchema, "workOrders");
export default WorkOrder;
