const UserService = require("./userService");

class EmployeeService extends UserService {
  
  constructor(employee, repository) {
    super(employee);
    this._repository = repository;
  }
      // TODO: Arreglar los otros metodos excepto create
   async getAll() {
    const employees = await this._repository.getAllEmployees();
      return employees.map((employee) => {
        console.log(rest);
        const { password, ...rest } = employee.toObject();
        return rest
      });
    }
  
    async getEmployee() {
      const employee = await this._repository.getEmployeeById(this.newUser.id);
      if (!employee) {
        throw new Error("Employee not found");
      }
      return employee.toObject();
    }

    async create(){
      if(this.validateUser()){
        return await this._repository.createEmployee(this.newUser)
      }else{
        return Error("No se han recibido datos del empleado");
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

module.exports = EmployeeService;