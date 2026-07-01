import { Request, Response } from 'express';
import { httpStatusCode } from '@/utils/httpStatus.js';
import ServiceFactory from '@/factories/serviceFactory.js';

async function getAllEmployees(req: Request, res: Response) {
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const employeeService = ServiceFactory.getService("employee", null, { companyId, role: userRole, userType: (req as any).userType });
  const getUsers = await employeeService.getAll();
  res.status(httpStatusCode.OK).json({ users: getUsers });  
}

async function getEmployeeById(req: Request, res: Response) {
  const { id } = req.params;
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const userType = (req as any).userType;
  const employeeService = ServiceFactory.getService("employee", { id }, { companyId, role: userRole, userType });
  const employee = await employeeService.getEmployee();
  res.status(httpStatusCode.OK).json({ user: employee });
}

async function createEmployee(req: Request, res: Response){
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const userType = (req as any).userType;
  const employeeService = ServiceFactory.getService("employee", { ...req.body, companyId }, { companyId, role: userRole, userType });
  const employee = await employeeService.create();
  res.status(httpStatusCode.OK).json({ user: employee });
}

async function deleteEmployee(req: Request, res: Response) {
  const { id } = req.params;
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const userType = (req as any).userType;
  const employeeService = ServiceFactory.getService("employee", req.body, { companyId, role: userRole, userType });
  const deletedEmployee = await employeeService.delete(id);
  if (!deletedEmployee) {
    return res.status(httpStatusCode.NOT_FOUND).json({
      message: "Employee not found",
    });
  } else {
    return res.status(httpStatusCode.OK).json({
      message: "Employee deleted successfully",
    });
  }
}

export { getAllEmployees, getEmployeeById, createEmployee, deleteEmployee };
