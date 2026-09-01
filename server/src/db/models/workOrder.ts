import { Schema, model } from 'mongoose';
import { IWorkOrder } from '@/types/models.js';

const workOrderSchema = new Schema(
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
      default: () => new Date(),
    },
    status: {
      type: String,
      // domain: pendiente (ES) — WorkOrder status; stored in English
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    completedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const WorkOrder = model<IWorkOrder>("WorkOrder", workOrderSchema, "workOrders");
export default WorkOrder;
