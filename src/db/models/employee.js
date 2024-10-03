const { Schema, model } = require("mongoose");
const {
  encryptPassword,
  checkingPassword,
  signSession,
} = require("../../utils/utils");

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
      select: false,
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

const Employee = model("Employee", employeeSchema, "employees");
module.exports = Employee;
