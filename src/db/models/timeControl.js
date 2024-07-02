const { Schema, model } = require("mongoose");

const controlTimeSchema = new Schema(
  {
    employee: {
      type: Schema.Types.UUID,
      ref: "Employee",
      trim: true,
    },
    date: {
      type: Date,
      trim: true,
      require: true,
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
    locations: {
      type: Schema.Types.ObjectId,
      ref: "Location",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

controlTimeSchema.pre("save", (next) => {
  const currentDate = new Date();
  this.date = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  ).toLocaleString("es-BO", { day: "2-digit", month: "long", year: "numeric" });
  next();
});

controlTimeSchema.pre("save", (next) => {
  const currentDate = new Date();
  this.date = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  ).toLocaleString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  next();
});

const ControlTime = model("ControlTime", controlTimeSchema, "timeControls");
module.exports = ControlTime;
