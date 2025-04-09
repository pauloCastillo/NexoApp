const { ManagerModel } = require("../db/models");

class ManagerRepository {
    async getAllManager() {
        const managers = await ManagerModel.find().populate("department");
        return managers;
    }

    async getManagerById(id) {
        return await ManagerModel.findById(id);
    }
    
    async createManager(managerData) {
        const registerNewUser = new ManagerModel(managerData);
        const savedUser = await registerNewUser.save();
        delete managerData.password;
        return await this.addTokenToManager(savedUser._id);
    }

    async updateManager(id, managerData) {
        const updatedManager = await ManagerModel.findByIdAndUpdate(id, managerData, { new: true });
        return updatedManager;
    }

    async deleteManager(id) {
        const deletedManager = await ManagerModel.findByIdAndDelete(id);
        return deletedManager;
    }

    async addTokenToManager(id) {
        const user = await this.getManagerById(id);
        user.createToken();
        return user.toJSON();
    }
      // async loginChecking() {
  //   const findingUser = await Employee.findOne({ mail: this.#newUser.email });
  //   return await findingUser.authenticateUser(
  //     this.#newUser.password,
  //     findingUser._id
  //   );
  // }
}

module.exports = ManagerRepository;