class PermissionService {
  constructor(data, repository) {
    this._data = data;
    this._repository = repository;
  }

  async getByEmployee(employeeId) {
    return await this._repository.getPermissionsByEmployee(employeeId);
  }

  async create() {
    return await this._repository.createPermission(this._data);
  }
}

export default PermissionService;
