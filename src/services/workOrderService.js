class WorkOrderService {
  constructor(data, repository) {
    this._data = data;
    this._repository = repository;
  }

  async getByEmployee(employeeId) {
    return await this._repository.getWorkOrdersByEmployee(employeeId);
  }

  async create() {
    return await this._repository.createWorkOrder(this._data);
  }
}

export default WorkOrderService;
