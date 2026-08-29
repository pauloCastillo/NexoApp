import { Request, Response } from 'express';
import { httpStatusCode } from '@/utils/httpStatus.js';
import ServiceFactory from '@/factories/serviceFactory.js';
import auditLogService from '@/services/auditLogService.js';

async function getAllEmployees(req: Request, res: Response) {
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const employeeService = ServiceFactory.getService("employee", null, { companyId, role: userRole });
  const getUsers = await employeeService.getAll();
  res.status(httpStatusCode.OK).json({ users: getUsers });  
}

async function getEmployeeById(req: Request, res: Response) {
  const { employee_id: id } = req.params;
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const employeeService = ServiceFactory.getService("employee", null, { companyId, role: userRole });
  const employee = await employeeService.getById(id);
  res.status(httpStatusCode.OK).json({ user: employee });
}

async function createEmployee(req: Request, res: Response){
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const employeeService = ServiceFactory.getService("employee", null, { companyId, role: userRole });
  const employee = await employeeService.create({ ...req.body, companyId });
  auditLogService.log({ action: 'employee.created', entityType: 'Employee', entityId: employee?.id, userId: req.userId, companyId, ipAddress: req.ip });
  res.status(httpStatusCode.OK).json({ user: employee });
}

async function deleteEmployee(req: Request, res: Response) {
  const { employee_id: id } = req.params;
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const employeeService = ServiceFactory.getService("employee", null, { companyId, role: userRole });
  const deletedEmployee = await employeeService.delete(id);
  if (!deletedEmployee) {
    return res.status(httpStatusCode.NOT_FOUND).json({
      message: "Employee not found",
    });
  } else {
    auditLogService.log({ action: 'employee.deleted', entityType: 'Employee', entityId: id, userId: req.userId, companyId, ipAddress: req.ip });
    return res.status(httpStatusCode.OK).json({
      message: "Employee deleted successfully",
    });
  }
}

async function updateEmployee(req: Request, res: Response) {
  const { employee_id: id } = req.params;
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const employeeService = ServiceFactory.getService("employee", null, { companyId, role: userRole });
  const updated = await employeeService.update(id, req.body);
  if (!updated) {
    return res.status(httpStatusCode.NOT_FOUND).json({ message: "Employee not found" });
  }
  auditLogService.log({ action: 'employee.updated', entityType: 'Employee', entityId: id, userId: req.userId, companyId, ipAddress: req.ip });
  res.status(httpStatusCode.OK).json({ user: updated });
}

export { getAllEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee };
