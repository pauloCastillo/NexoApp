import { Schema, model } from 'mongoose';
import { IControlTime } from '@/types/models.js';

const controlTimeSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    date: {
      type: Schema.Types.Date,
      required: true,
      default: () => new Date(),
    },
    entrada: {
      type: String,
    },
    descanso: {
      type: String,
    },
    retorno: {
      type: String,
    },
    salida: {
      type: String,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: "Location",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ControlTime = model<IControlTime>("ControlTime", controlTimeSchema, "timeControls");
export default ControlTime;
