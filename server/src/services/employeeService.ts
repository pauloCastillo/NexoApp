import UserService from '@/services/userService.js';
import EmployeeRepository from '@/repositories/employeeRepository.js';

class EmployeeService extends UserService {
  private _repository: EmployeeRepository;

  constructor(employee: Record<string, any>, repository: EmployeeRepository, context?: import('@/types/models.js').TenantContext) {
    super(employee, context);
    this._repository = repository;
  }

   async getAll() {
    if(this.newUser === null){
      const employees = await this._repository.getAllEmployees(this._context!);
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
      const employee = await this._repository.getEmployeeById(this.newUser.id, this._context!);
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
        return await this._repository.createEmployee(this.newUser, this._context!)
      }else{
        return Error("No se han recibido datos del empleado");
      }
    }
  
    async update(id: string, employeeData: Record<string, any>) {
      
      if(this.newUser === null){
        throw new Error("the server cannot found the resource");
      }

      const updatedEmployee = await this._repository.updateEmployee(id, employeeData, this._context!);
      if (!updatedEmployee) {
        throw new Error("Employee not found");
      }
      return updatedEmployee.toObject();
    }
  
    async delete(id: string) {
      
      if(this.newUser === null){
        throw new Error("the server cannot found the resource");
      }

      const deletedEmployee = await this._repository.deleteEmployee(id, this._context!);
      return deletedEmployee!.toObject();
    }
}

export default EmployeeService;