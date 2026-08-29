import { Schema, model, HydratedDocument } from 'mongoose';
import {
  encryptPassword,
  checkingPassword,
  signSession,
} from '@/utils/utils.js';
import { IUser } from '@/types/models.js';

const userSchema = new Schema(
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
      unique: true,
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
      enum: ['superuser', 'platform_admin', 'support', 'business_owner', 'admin', 'supervisor', 'hr_manager', 'employee'],
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
    },
    jobTitle: {
      type: String,
      trim: true,
    },
    controlTimeID: {
      type: Schema.Types.ObjectId,
      ref: 'ControlTime',
    },
    refreshTokenHash: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre('save', async function (this: HydratedDocument<IUser>) {
  if (this.isModified('password')) {
    this.password = await encryptPassword(this.password);
  }
});

userSchema.methods = {
  async authenticateUser(this: HydratedDocument<IUser>, password: string, id: string) {
    const user = await model('User').findById(id).select('password').exec() as HydratedDocument<IUser>;
    return checkingPassword(password, user.password);
  },
  createToken(this: HydratedDocument<IUser>) {
    const user = {
      email: this.email,
      username: this.username,
    };
    return signSession(user);
  },
  toJSON(this: HydratedDocument<IUser>) {
    return {
      id: this._id,
      username: this.username,
      email: this.email,
      role: this.role,
      token: `${this.createToken()}`,
    };
  },
};

const User = model<IUser>('User', userSchema, 'users');
export default User;
