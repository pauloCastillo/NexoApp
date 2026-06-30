import {  Schema, model  } from 'mongoose';
import { 
  encryptPassword,
  checkingPassword,
  signSession,
 } from '../../utils/utils.js';

const employeeSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      require: true,
    },
    companyName:{
      type: String,
      trim: true,
      require: true,
    },
    email: {
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
      select: false,
      require: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["employee", "manager", "admin"],
      default: "employee",
    },
    controlTimeID: {
      type: Schema.Types.ObjectId,
      ref: "ControlTime",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

employeeSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await encryptPassword(this.password);
  }
  next();
});

employeeSchema.methods = {
  async authenticateUser(password, id) {
    const user = await model("Employee").findById(id).select("password").exec();
    return checkingPassword(password, user.password);
  },
  createToken() {
    const user = {
      email: this.email,
      username: this.username,
    };
    return signSession(user);
  },
  toJSON() {
    return {
      id: this._id,
      username: this.username,
      email: this.email,
      role: this.role,
      controlTimeID: this.controlTimeID,
      token: `${this.createToken()}`,
    };
  },
};

const Employee = model("Employee", employeeSchema, "employees");
export default Employee;
