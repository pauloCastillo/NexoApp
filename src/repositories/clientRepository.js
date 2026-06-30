import {  Client  } from '../db/models/index.js';

class ClientRepository {
  async getAllClients() {
    return await Client.find().populate("createdBy", "username email");
  }

  async getClientsByCompany(companyName) {
    return await Client.find({ companyName });
  }

  async createClient(clientData) {
    const newClient = new Client(clientData);
    return await newClient.save();
  }
}

export default ClientRepository;
