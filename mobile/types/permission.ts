/** Permission type options */
export type PermissionType = "permiso" | "licencia" | "otro";

/** Permission request status */
export type PermissionStatus = "pendiente" | "aprobado" | "rechazado";

/** Permission data structure */
export interface Permission {
  _id: string;
  employee: string;
  type: PermissionType;
  startDate: string;
  endDate: string;
  reason: string;
  status: PermissionStatus;
}

/** Payload for submitting a permission request */
export interface SubmitPermissionPayload {
  employee: string;
  type: PermissionType;
  startDate: string;
  endDate: string;
  reason: string;
}

/** Shape of the permissions slice in Redux */
export interface PermissionState {
  list: Permission[];
  status: string;
  message: string;
}
