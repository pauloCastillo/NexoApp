const UserService = require("./userService");

class Manager extends UserService {
  constructor(manager, repository) {
    super(manager);
    this._repository = repository;
  }

  // TODO: Arreglar los otros metodos excepto create

  async getAll() {
    const employees = await this.repository.getAllManagers();
      return employees.map((employee) => {
        const { password, ...rest } = employee.toObject();
        return rest
      });
    }
    async getManager() {
      const manager = await this._repository.getManagerById(this.newUser);
      if (!manager) {
        throw new Error("El correo y contraseña no coinciden");
      }
      return manager.toObject();
    }
  

  async create() {
    if(this.validateUser()){
      return await this._repository.createManager(this.newUser);
    }else{
      return Error("No se han recibido datos del administrador");
    }
  }

  async update(id, employeeData) {
    const updatedEmployee = await this.repository.updateManager(id, employeeData);
    if (!updatedEmployee) {
      throw new Error("Employee not found");
    }
    return updatedEmployee.toObject();
  }

  async delete(id) {
    const deletedEmployee = await this.repository.deleteManager(id);
    return deletedEmployee.toObject();
  }
}

module.exports = Manager;