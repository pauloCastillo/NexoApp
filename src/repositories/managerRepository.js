const { ManagerModel } = require("../db/models");
const { checkingPassword } = require("../utils/utils");

class ManagerRepository {
    async getAllManagers() {
        const managers = await ManagerModel.find().populate("department");
        return managers;
    }

    async getManagerById(managerData) {
        const foundManager = await ManagerModel.findOne({ email: managerData.email });
        const verifiedManager  = await ManagerModel.schema.methods.authenticateUser(managerData.password, foundManager._id.toString());
        if(verifiedManager){
            delete managerData.password;
            return foundManager;
        }else{
            return  new Error("La contraseña no coincide con el correo");
        }
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
}

module.exports = ManagerRepository;