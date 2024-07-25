const { Schema, model } = require("mongoose");
const { findingEmployee } = require("../../utils/utils");

const controlTimeSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
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

controlTimeSchema.pre("save", async (next) => {
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

controlTimeSchema.methods = {
  async getEmployees() {
    try {
      return await ControlTime.find().where("employee").exists();
    } catch (error) {
      return error.message;
    }
  },
};

const ControlTime = model("ControlTime", controlTimeSchema, "timeControls");
module.exports = ControlTime;
