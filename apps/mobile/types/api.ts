/** Generic wrapper for consistent API responses */
export interface ApiResponse<T> {
  message?: string;
  data?: T;
  employee?: T;
  client?: T;
  clients?: T[];
  vacation?: T;
  vacations?: T[];
  permission?: T;
  permissions?: T[];
  workOrder?: T;
  workOrders?: T[];
  [key: string]: unknown;
}

/** Credentials shape stored in AsyncStorage (legacy — kept for migration compat) */
export interface AuthCredentials {
  userId: string;
  userToken: string;
}

/** Keys for the app */
export const STORAGE_KEYS = {
  REGISTER: "@register",
  REGISTER_DATES: "@registerDates",
} as const;
