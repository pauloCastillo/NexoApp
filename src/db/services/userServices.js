const { Employee, ControlTime, JobTitle } = require("../models");

class User {
  #newUser = {};

  constructor(employee) {
    this.#newUser = employee;
  }

  async createEmployee() {
    if (
      this.#newUser.confirmPassword.toLowerCase() !==
      this.#newUser.password.toLowerCase()
    ) {
      throw new Error(
        "Por favor, revisa que las contraseñas sean escritas iguales"
      );
    }
    const registerNewUser = new Employee(this.#newUser);
    const savedUser = await registerNewUser.save();
    const createATimeControl = new ControlTime({
      employee: savedUser._id,
    });
    const newJob = new JobTitle({ employee: savedUser._id, job_Title: savedUser.jobTitle});
    await newJob.save();
    await createATimeControl.save();
    delete this.#newUser.password;
    return await this.addTokenToUser(savedUser._id);
  }

  async #readEmployee(id) {
    return await Employee.findById(id);
  }

  async updateEmployee(user) {
    const data = await Employee.findOneAndUpdate({
      mail: this.#newUser.email,
    }).replaceOne(user);

    return data;
  }
  async deleteEmployee(mail) {
    const userDeleted = await Employee.findOneAndDelete({
      mail: mail
    });
    return userDeleted;
  }

  async loginChecking() {
    const findingUser = await Employee.findOne({ mail: this.#newUser.email });
    return await findingUser.authenticateUser(
      this.#newUser.password,
      findingUser._id
    );
  }

  async addTokenToUser(id) {
    const user = await this.#readEmployee(id);
    user.createToken();
    return user.toJSON();
  }
}

class Manager extends User {
  constructor(...args) {
    super(args);
  }
}

module.exports = {
  User,
  Manager,
};
