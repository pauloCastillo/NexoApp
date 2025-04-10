const { Schema, model } = require("mongoose");
const {
  encryptPassword,
  checkingPassword,
  signSession,
} = require("../../utils/utils");

const managerSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      require: true,
    },
    email: {
      type: String,
      trim: true,
      require: true,
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
      enum: ["admin", "employee"],
      default: "admin",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

managerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await encryptPassword(this.password);
  }
  next();
});

managerSchema.methods = {
  async authenticateUser(password, id) {
    const user = await model("Manager").findById(id).select("password").exec();
    return checkingPassword(password, user.password);
  },
  createToken() {
    const user = {
      email: this.mail,
      username: this.username,
    };
    return signSession(user);
  },
  toJSON() {
    return {
      id: this._id,
      username: this.username,
      email: this.mail,
      token: `${this.createToken()}`,
    };
  },
};

const Manager = model("Manager", managerSchema, "admins");
module.exports = Manager;
