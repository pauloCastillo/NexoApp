import { WorkOrder } from '@/db/models/index.js';
import { TenantContext } from '@/types/models.js';

class WorkOrderRepository {
  #companyFilter(context: TenantContext): Record<string, any> {
    return context.role === 'superuser' ? {} : { company: context.companyId };
  }

  async getById(id: string, context: TenantContext) {
    return await WorkOrder.findOne({ _id: id, ...this.#companyFilter(context) });
  }

  async getWorkOrdersByEmployee(employeeId: string, context: TenantContext) {
    return await WorkOrder.find({ employee: employeeId, ...this.#companyFilter(context) })
      .populate("client", "contactName contactLastName companyName")
      .sort({ createdAt: -1 });
  }

  async createWorkOrder(orderData: Record<string, any>, context: TenantContext) {
    orderData.company = context.companyId;
    const newOrder = new WorkOrder(orderData);
    return await newOrder.save();
  }

  async updateWorkOrder(id: string, data: Record<string, any>, context: TenantContext) {
    return await WorkOrder.findOneAndUpdate(
      { _id: id, ...this.#companyFilter(context) },
      data,
      { new: true }
    );
  }

  async deleteWorkOrder(id: string, context: TenantContext) {
    return await WorkOrder.findOneAndDelete({ _id: id, ...this.#companyFilter(context) });
  }
}

export default WorkOrderRepository;
