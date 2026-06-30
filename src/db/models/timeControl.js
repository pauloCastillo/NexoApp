import {  Schema, model  } from 'mongoose';
import {  DateTime  } from 'luxon';

const controlTimeSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
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

const ControlTime = model("ControlTime", controlTimeSchema, "timeControls");
export default ControlTime;
