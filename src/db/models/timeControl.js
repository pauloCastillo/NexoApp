const { Schema, model } = require("mongoose");
const { date } = require("./locations");

const currentDate = Date.now();
const controlTimeSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
    date: {
      type: Schema.Types.Date,
      required: true,
      default: () => new Date(currentDate).toLocaleDateString("es-BO", { dateStyle:"short"}),
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
module.exports = ControlTime;
