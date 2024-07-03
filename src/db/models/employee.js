const { Schema, model } = require("mongoose");
const { v6: uuid } = require("uuid");
const employeeSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      require: true,
    },
    mail: {
      type: String,
      trim: true,
      require: true,
    },
    jobTitle: {
      type: String,
    },
    password: {
      type: String,
      trim: true,
      require: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    time_control: {
      type: Schema.Types.ObjectId,
      ref: "TimeControl",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Employee = model("Employee", employeeSchema, "employees");
module.exports = Employee;
