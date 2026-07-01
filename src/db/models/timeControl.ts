import { Schema, model } from 'mongoose';
import { DateTime } from 'luxon';
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
      default: () => DateTime.now().setZone("America/La_Paz").toISO(),
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
