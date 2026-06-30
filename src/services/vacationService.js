class VacationService {
  constructor(data, repository) {
    this._data = data;
    this._repository = repository;
  }

  async getByEmployee(employeeId) {
    return await this._repository.getVacationsByEmployee(employeeId);
  }

  async create() {
    return await this._repository.createVacation(this._data);
  }
}

export default VacationService;
