class ClientService {
  constructor(data, repository) {
    this._data = data;
    this._repository = repository;
  }

  async getAll() {
    return await this._repository.getAllClients();
  }

  async getByCompany(companyName) {
    return await this._repository.getClientsByCompany(companyName);
  }

  async create() {
    return await this._repository.createClient(this._data);
  }
}

export default ClientService;
