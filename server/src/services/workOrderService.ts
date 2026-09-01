import type { TenantContext } from '@/types/models.js';
import WorkOrderRepository from '@/repositories/workOrderRepository.js';

// domain: pendiente (ES) -> pending, en_progreso -> in_progress, etc. Stored in English.
const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

// Back-compat: map legacy ES values to English
const LEGACY_STATUS_MAP: Record<string, string> = {
  pendiente: 'pending',
  en_progreso: 'in_progress',
  completado: 'completed',
  cancelado: 'cancelled',
};
const normalizeStatus = (s: string) => LEGACY_STATUS_MAP[s] ?? s;

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
    return await this._transitionStatus(id, 'in_progress');
  }

  async complete(id: string) {
    // ponytail: atomic transition to avoid TOCTOU
    const doc = await this._repository.transitionStatus(id, 'in_progress', 'completed', { completedAt: new Date() }, this._context!);
    if (!doc) throw new Error('WorkOrder not found or invalid transition');
    return doc;
  }

  async cancel(id: string, reason: string) {
    const doc = await this._repository.getById(id, this._context!);
    if (!doc) throw new Error('WorkOrder not found');
    const status = normalizeStatus(doc.status);
    if (!VALID_TRANSITIONS[status]?.includes('cancelled')) {
      throw new Error(`No se puede cancelar una orden en estado ${doc.status}`);
    }
    // ponytail: atomic where possible, fallback to update if legacy status present
    const updated = await this._repository.transitionStatus(id, status, 'cancelled', { cancelledAt: new Date(), cancellationReason: reason }, this._context!);
    return updated ?? await this._repository.updateWorkOrder(id, { status: 'cancelled', cancelledAt: new Date(), cancellationReason: reason }, this._context!);
  }

  async _transitionStatus(id: string, newStatus: string) {
    const doc = await this._repository.getById(id, this._context!);
    if (!doc) throw new Error('WorkOrder not found');
    const status = normalizeStatus(doc.status);
    if (!VALID_TRANSITIONS[status]?.includes(newStatus)) {
      throw new Error(`Transición inválida de ${doc.status} a ${newStatus}`);
    }
    const updated = await this._repository.transitionStatus(id, status, newStatus, { status: newStatus }, this._context!);
    if (!updated) throw new Error(`Transición inválida de ${doc.status} a ${newStatus} (conflicto concurrente)`);
    return updated;
  }
}

export default WorkOrderService;