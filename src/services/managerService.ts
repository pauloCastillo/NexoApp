import UserService from '@/services/userService.js';
import ManagerRepository from '@/repositories/managerRepository.js';

class Manager extends UserService {
  private _repository: ManagerRepository;

  constructor(manager: Record<string, any>, repository: ManagerRepository, context?: import('@/types/models.js').TenantContext) {
    super(manager, context);
    this._repository = repository;
  }

  async getAll() {
    const employees = await this._repository.getAllManagers(this._context!);
      return employees.map((employee) => {
        const { password, ...rest } = employee.toObject();
        return rest
      });
    }
    async getManager() {
      const manager = await this._repository.getManagerById(this.newUser as { email: string; password: string }, this._context!);
      if (!manager) {
        throw new Error("El correo y contraseña no coinciden");
      }
      return manager.toObject();
    }
  

  async create() {
    if(this.validateUser()){
      return await this._repository.createManager(this.newUser, this._context!);
    }else{
      return Error("No se han recibido datos del administrador");
    }
  }

  async update(id: string, employeeData: Record<string, any>) {
    const updatedEmployee = await this._repository.updateManager(id, employeeData, this._context!);
    if (!updatedEmployee) {
      throw new Error("Employee not found");
    }
    return updatedEmployee.toObject();
  }

  async delete(id: string) {
    const deletedEmployee = await this._repository.deleteManager(id, this._context!);
    return deletedEmployee!.toObject();
  }
}

export default Manager;