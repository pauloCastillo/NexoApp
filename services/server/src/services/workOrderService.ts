import type { TenantContext } from '@/types/models.js';
import WorkOrderRepository from '@/repositories/workOrderRepository.js';

const VALID_TRANSITIONS: Record<string, string[]> = {
  pendiente: ['en_progreso', 'cancelado'],
  en_progreso: ['completado', 'cancelado'],
  completado: [],
  cancelado: [],
};

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

  async update(id: string) {
    return await this._repository.updateWorkOrder(id, this._data, this._context!);
  }

  async delete(id: string) {
    return await this._repository.deleteWorkOrder(id, this._context!);
  }

  async start(id: string) {
    return await this._transitionStatus(id, 'en_progreso');
  }

  async complete(id: string) {
    const doc = await this._repository.getById(id, this._context!);
    if (!doc) throw new Error('WorkOrder not found');
    if (doc.status !== 'en_progreso') throw new Error('Solo órdenes en progreso pueden completarse');
    return await this._repository.updateWorkOrder(id, { status: 'completado', completedAt: new Date() }, this._context!);
  }

  async cancel(id: string, reason: string) {
    const doc = await this._repository.getById(id, this._context!);
    if (!doc) throw new Error('WorkOrder not found');
    if (!VALID_TRANSITIONS[doc.status]?.includes('cancelado')) {
      throw new Error(`No se puede cancelar una orden en estado ${doc.status}`);
    }
    return await this._repository.updateWorkOrder(id, { status: 'cancelado', cancelledAt: new Date(), cancellationReason: reason }, this._context!);
  }

  async _transitionStatus(id: string, newStatus: string) {
    const doc = await this._repository.getById(id, this._context!);
    if (!doc) throw new Error('WorkOrder not found');
    if (!VALID_TRANSITIONS[doc.status]?.includes(newStatus)) {
      throw new Error(`Transición inválida de ${doc.status} a ${newStatus}`);
    }
    return await this._repository.updateWorkOrder(id, { status: newStatus }, this._context!);
  }
}

export default WorkOrderService;