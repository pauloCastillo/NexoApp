import UserService from './userService.js';

class EmployeeService extends UserService {
  
  constructor(employee, repository) {
    super(employee);
    this._repository = repository;
  }

   async getAll() {
    if(this.newUser === null){
      const employees = await this._repository.getAllEmployees();
        return employees.map((employee) => {
          const rest = employee.toObject();
          return rest
        });
      }
    }
  
    async getEmployee() {
      if(this.newUser === null){
        throw new Error("the server cannot found the resource");
      }
      const employee = await this._repository.getEmployeeById(this.newUser.id);
      if (!employee) {
        throw new Error("Employee not found");
      }
      return employee.toObject();
    }

    async create(){
      
      if(this.newUser === null){
        throw new Error("the server cannot found the resource");
      }

      if(this.validateUser()){
        return await this._repository.createEmployee(this.newUser)
      }else{
        return Error("No se han recibido datos del empleado");
      }
    }
  
    async update(id, employeeData) {
      
      if(this.newUser === null){
        throw new Error("the server cannot found the resource");
      }

      const updatedEmployee = await this.repository.updateEmployee(id, employeeData);
      if (!updatedEmployee) {
        throw new Error("Employee not found");
      }
      return updatedEmployee.toObject();
    }
  
    async delete(id) {
      
      if(this.newUser === null){
        throw new Error("the server cannot found the resource");
      }

      const deletedEmployee = await this.repository.deleteEmployee(id);
      return deletedEmployee.toObject();
    }
}

export default EmployeeService;