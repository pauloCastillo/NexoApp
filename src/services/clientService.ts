import type { TenantContext } from '@/types/models.js';
import ClientRepository from '@/repositories/clientRepository.js';

class ClientService {
  private _data: Record<string, any>;
  private _repository: ClientRepository;
  private _context?: TenantContext;

  constructor(data: Record<string, any>, repository: ClientRepository, context?: TenantContext) {
    this._data = data;
    this._repository = repository;
    this._context = context;
  }

  async getAll() {
    return await this._repository.getAllClients(this._context!);
  }

  async getByCompany(companyName: string) {
    return await this._repository.getClientsByCompany(companyName, this._context!);
  }

  async create() {
    return await this._repository.createClient(this._data, this._context!);
  }
}

export default ClientService;
