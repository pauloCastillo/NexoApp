import type { TenantContext } from '@/types/models.js';
import TimeControlRepository from '@/repositories/timeControlRepository.js';

class TimeControlService {
  private _data: Record<string, any>;
  private _repository: TimeControlRepository;
  private _context?: TenantContext;

  constructor(data: Record<string, any>, repository: TimeControlRepository, context?: TenantContext) {
    this._data = data;
    this._repository = repository;
    this._context = context;
  }

  async registerTime() {
    const employeesTime = await this._repository.getTimeControlById(this._data.employee, this._context!);
    if (!employeesTime) throw new Error("Time control not found");
    return await this._repository.createTimeControl(String(employeesTime._id), this._data as any, this._context!);
  }
}

export default TimeControlService;
