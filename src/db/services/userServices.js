const { Employee, ControlTime } = require("../models");

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
    await createATimeControl.save();
    delete this.#newUser.password;
    this.addTokenToUser(savedUser._id);
    return savedUser;
  }

  async #readEmployee(id) {
    const findingUser = await Employee.findById(id);
    return findingUser;
  }

  async updateEmployee(updateUserData) {
    const userUpdated = await Employee.findOneAndUpdate({
      mail: this.#newUser.email,
    }).replaceOne(updateUserData);

    return userUpdated;
  }
  async deleteEmployee(mail) {
    const userDeleted = await Employee.findOneAndDelete({
      mail: this.#newUser.email,
    });
    return userDeleted;
  }

  async loginChecking() {
    const findingUser = await Employee.findOne({ mail: this.#newUser.email });
    const existUser = await findingUser.authenticateUser(
      this.#newUser.password,
      findingUser._id
    );
    return existUser;
  }

  async addTokenToUser(id) {
    const user = await this.#readEmployee(id);
    user.createToken();
    user.toJSON();
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
