import { Schema, model, HydratedDocument } from 'mongoose';
import {
  encryptPassword,
  checkingPassword,
  signSession,
} from '@/utils/utils.js';
import { IEmployee } from '@/types/models.js';

const employeeSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
    },
    companyName:{
      type: String,
      trim: true,
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    jobTitle: {
      type: String,
    },
    password: {
      type: String,
      trim: true,
      select: false,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["employee", "editor", "manager"],
      default: "employee",
    },
    controlTimeID: {
      type: Schema.Types.ObjectId,
      ref: "ControlTime",
    },
    refreshTokenHash: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

employeeSchema.pre("save", async function (this: HydratedDocument<IEmployee>) {
  if (this.isModified("password")) {
    this.password = await encryptPassword(this.password);
  }
});

employeeSchema.methods = {
  async authenticateUser(this: HydratedDocument<IEmployee>, password: string, id: string) {
    const user = await model("Employee").findById(id).select("password").exec() as HydratedDocument<IEmployee>;
    return checkingPassword(password, user.password);
  },
  createToken(this: HydratedDocument<IEmployee>) {
    const user = {
      email: this.email,
      username: this.username,
    };
    return signSession(user);
  },
  toJSON(this: HydratedDocument<IEmployee>) {
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

const Employee = model<IEmployee>("Employee", employeeSchema, "employees");
export default Employee;
