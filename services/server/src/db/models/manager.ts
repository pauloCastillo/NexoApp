import { Schema, model, HydratedDocument } from 'mongoose';
import {
  encryptPassword,
  checkingPassword,
  signSession,
} from '@/utils/utils.js';
import { IManager } from '@/types/models.js';

const managerSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
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
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
    role: {
      type: String,
      enum: ["superuser", "editor", "manager", "viewer"],
      default: "editor",
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

managerSchema.pre("save", async function (this: HydratedDocument<IManager>) {
  if (this.isModified("password")) {
    this.password = await encryptPassword(this.password);
  }
});

managerSchema.methods = {
  async authenticateUser(this: HydratedDocument<IManager>, password: string, id: string) {
    const user = await model("Manager").findById(id).select("password").exec() as HydratedDocument<IManager>;
    return checkingPassword(password, user.password);
  },
  createToken(this: HydratedDocument<IManager>) {
    const user = {
      email: this.email,
      username: this.username,
    };
    return signSession(user);
  },
  toJSON(this: HydratedDocument<IManager>) {
    return {
      id: this._id,
      username: this.username,
      email: this.email,
      token: `${this.createToken()}`,
    };
  },
};

const Manager = model<IManager>("Manager", managerSchema, "admins");
export default Manager;
