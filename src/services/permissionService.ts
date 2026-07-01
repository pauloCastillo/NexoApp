import type { TenantContext } from '@/types/models.js';
import PermissionRepository from '@/repositories/permissionRepository.js';

class PermissionService {
  private _data: Record<string, any>;
  private _repository: PermissionRepository;
  private _context?: TenantContext;

  constructor(data: Record<string, any>, repository: PermissionRepository, context?: TenantContext) {
    this._data = data;
    this._repository = repository;
    this._context = context;
  }

  async getByEmployee(employeeId: string) {
    return await this._repository.getPermissionsByEmployee(employeeId, this._context!);
  }

  async create() {
    return await this._repository.createPermission(this._data, this._context!);
  }
}

export default PermissionService;
