/** Employee data stored in Redux after login/register */
export interface Employee {
  id?: string;
  username: string;
  email: string;
  role: string;
  companyName?: string;
  jobTitle?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

/** Payload sent when registering a new employee */
export interface RegisterEmployeePayload {
  username: string;
  companyName?: string;
  inviteCode?: string;
  email: string;
  jobTitle: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

/** Payload sent when logging in */
export interface LoginPayload {
  mail: string;
  password: string;
}

/** Shape of the employees slice in Redux */
export interface EmployeeState {
  id: string;
  employee: Pick<Employee, "username" | "email" | "role"> | null;
  status: string;
  message: string;
  role: string;
  username: string;
}

/** API response when registering an employee */
export interface RegisterEmployeeResponse {
  newEmployee?: {
    id?: string | number;
    username?: string;
    token?: string;
    role?: string;
    [key: string]: unknown;
  };
  id?: string;
  token?: string;
  message?: string;
  [key: string]: unknown;
}

/** API response when logging in */
export interface LoginResponse {
  employee?: {
    id?: string | number;
    token?: string;
    role?: string;
    [key: string]: unknown;
  };
  message?: string;
  [key: string]: unknown;
}
