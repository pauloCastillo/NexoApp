/** Client data structure */
export interface Client {
  _id?: string;
  contactName: string;
  contactLastName?: string;
  email?: string;
  phone?: string;
  companyName: string;
  createdBy?: string;
}

/** Payload for creating a new client */
export interface CreateClientPayload {
  contactName: string;
  contactLastName?: string;
  email?: string;
  phone?: string;
  companyName: string;
  createdBy?: string;
}

/** Shape of the clients slice in Redux */
export interface ClientState {
  list: Client[];
  status: string;
  message: string;
  selected: Client | null;
}
