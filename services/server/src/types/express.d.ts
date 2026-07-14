import 'express';

declare module 'express' {
  interface Request {
    employeeId?: string;
    companyId?: string;
    userRole?: string;
    userType?: string;
  }
}
