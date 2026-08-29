import { Schema, model } from 'mongoose';
import { IVacation } from '@/types/models.js';

const vacationSchema = new Schema(
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
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
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

const Vacation = model<IVacation>("Vacation", vacationSchema, "vacations");
export default Vacation;
