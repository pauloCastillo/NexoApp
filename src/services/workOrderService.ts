import type { TenantContext } from '@/types/models.js';
import WorkOrderRepository from '@/repositories/workOrderRepository.js';

class WorkOrderService {
  private _data: Record<string, any>;
  private _repository: WorkOrderRepository;
  private _context?: TenantContext;

  constructor(data: Record<string, any>, repository: WorkOrderRepository, context?: TenantContext) {
    this._data = data;
    this._repository = repository;
    this._context = context;
  }

  async getByEmployee(employeeId: string) {
    return await this._repository.getWorkOrdersByEmployee(employeeId, this._context!);
  }

  async create() {
    return await this._repository.createWorkOrder(this._data, this._context!);
  }
}

export default WorkOrderService;
