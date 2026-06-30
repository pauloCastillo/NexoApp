
class TimeControlService {

  constructor(data, repository) {
    this._data = data;
    this._repository = repository;
  }

  async registerTime() {
    const employeesTime = await this._repository.getTimeControlById(this._data.employee);
    return await this._repository.createTimeControl(employeesTime._id, this._data);
  }
}

export default TimeControlService;
