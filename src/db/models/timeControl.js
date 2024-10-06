const { Schema, model } = require("mongoose");

const controlTimeSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
    date: {
      type: Schema.Types.Date,
      default: Date.now,
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

controlTimeSchema.pre("save", function (next) {
  const currentdate = new Date();
  this.date = new Date(
    currentdate.getFullYear(),
    currentdate.getMonth(),
    currentdate.getDate()
  ).toDateString("es-BO");
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
