const UserService = require("./userService");

class Manager extends UserService {
  constructor(manager, repository) {
    super(manager);
    this._repository = repository;
  }

  // TODO: Arreglar los otros metodos excepto create

  async getAll() {
    const employees = await this.repository.getAllEmployees();
      return employees.map((employee) => {
        const { password, ...rest } = employee.toObject();
        return rest
      });
    }
    async getEmployee(id) {
      const employee = await this.repository.getEmployeeById(id);
      if (!employee) {
        throw new Error("Employee not found");
      }
      return employee.toObject();
    }
  

  async create() {
    if(this.validateUser()){
      return await this._repository.createManager(this.newUser);
    }else{
      return Error("No se han recibido datos del administrador");
    }
  }

  async update(id, employeeData) {
    const updatedEmployee = await this.repository.updateEmployee(id, employeeData);
    if (!updatedEmployee) {
      throw new Error("Employee not found");
    }
    return updatedEmployee.toObject();
  }

  async delete(id) {
    const deletedEmployee = await this.repository.deleteEmployee(id);
    return deletedEmployee.toObject();
  }
}

module.exports = Manager;