const { Employee, ControlTime } = require("../models");
const { encryptPassword } = require("../../utils/utils");

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

  updateEmployee() {}
  deleteEmployee() {}

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

module.exports = {
  User,
};
