import {  WorkOrder  } from '../db/models/index.js';

class WorkOrderRepository {
  async getWorkOrdersByEmployee(employeeId) {
    return await WorkOrder.find({ employee: employeeId })
      .populate("client", "contactName contactLastName companyName")
      .sort({ createdAt: -1 });
  }

  async createWorkOrder(orderData) {
    const newOrder = new WorkOrder(orderData);
    return await newOrder.save();
  }
}

export default WorkOrderRepository;
