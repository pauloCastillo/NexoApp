/** Work order data structure */
export interface WorkOrder {
  _id: string;
  employee: string;
  client: string | { contactName: string; companyName: string };
  clientName?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  description: string;
  createdAt: string;
}

/** Payload for submitting a work order */
export interface SubmitWorkOrderPayload {
  employee: string;
  client: string;
  clientName: string;
  location: {
    latitude: number;
    longitude: number;
  };
  description: string;
}

/** Shape of the orderDay slice in Redux */
export interface WorkOrderState {
  currentOrder: WorkOrder | null;
  history: WorkOrder[];
  status: string;
  message: string;
}
