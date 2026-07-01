import { Client } from '@/db/models/index.js';
import { IClient, TenantContext } from '@/types/models.js';

class ClientRepository {
  #companyFilter(context: TenantContext): Record<string, any> {
    return context.role === 'superuser' ? {} : { company: context.companyId };
  }

  async getAllClients(context: TenantContext) {
    return await Client.find(this.#companyFilter(context)).populate("createdBy", "username email");
  }

  async getClientsByCompany(companyName: string, context: TenantContext) {
    return await Client.find({ companyName, ...this.#companyFilter(context) });
  }

  async createClient(clientData: Record<string, any>, context: TenantContext) {
    clientData.company = context.companyId;
    const newClient = new Client(clientData);
    return await newClient.save();
  }
}

export default ClientRepository;
