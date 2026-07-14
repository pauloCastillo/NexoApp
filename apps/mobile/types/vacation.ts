/** Vacation request status */
export type VacationStatus = "pendiente" | "aprobado" | "rechazado";

/** Vacation data structure */
export interface Vacation {
  _id: string;
  employee: string;
  startDate: string;
  endDate: string;
  status: VacationStatus;
}

/** Payload for submitting a vacation request */
export interface SubmitVacationPayload {
  employee: string;
  startDate: string;
  endDate: string;
}

/** Shape of the vacations slice in Redux */
export interface VacationState {
  list: Vacation[];
  status: string;
  message: string;
}
