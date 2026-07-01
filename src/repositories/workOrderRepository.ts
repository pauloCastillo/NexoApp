import { WorkOrder } from '@/db/models/index.js';
import { IWorkOrder, TenantContext } from '@/types/models.js';

class WorkOrderRepository {
  #companyFilter(context: TenantContext): Record<string, any> {
    return context.role === 'superuser' ? {} : { company: context.companyId };
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
}

export default WorkOrderRepository;
