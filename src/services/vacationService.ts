import type { TenantContext } from '@/types/models.js';
import VacationRepository from '@/repositories/vacationRepository.js';

class VacationService {
  private _data: Record<string, any>;
  private _repository: VacationRepository;
  private _context?: TenantContext;

  constructor(data: Record<string, any>, repository: VacationRepository, context?: TenantContext) {
    this._data = data;
    this._repository = repository;
    this._context = context;
  }

  async getByEmployee(employeeId: string) {
    return await this._repository.getVacationsByEmployee(employeeId, this._context!);
  }

  async create() {
    return await this._repository.createVacation(this._data, this._context!);
  }

  async update(id: string) {
    return await this._repository.updateVacation(id, this._data, this._context!);
  }

  async delete(id: string) {
    return await this._repository.deleteVacation(id, this._context!);
  }
}

export default VacationService;
