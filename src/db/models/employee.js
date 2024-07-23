const { Schema, model } = require("mongoose");
const { encrypt, checkingPassword, signSession } = require("../../utils/utils");

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

employeeSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = this.encryptPassword(this.password);
  }
  next();
});

employeeSchema.methods = {
  encryptPassword(password) {
    return encrypt(password);
  },

  authenticateUser(password, id) {
    const user = model("Employee").findById(id).select("password");
    return checkingPassword(password, user.password);
  },
  createToken() {
    const user = {
      email: this.mail,
      username: this.ne,
    };
    return signSession(user);
  },
  toJSON() {
    return {
      id: this._id,
      username: this.username,
      email: this.email,
      token: `${this.createToken()}`,
    };
  },
};

const Employee = model("Employee", employeeSchema, "employees");
module.exports = Employee;
