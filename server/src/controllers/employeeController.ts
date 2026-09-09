import { Request, Response } from 'express';
import { httpStatusCode } from '@/utils/httpStatus.js';
import ServiceFactory from '@/factories/serviceFactory.js';
import auditLogService from '@/services/auditLogService.js';
import { proxyController } from '@/utils/proxyController.js';

async function _raw_getAllEmployees(req: Request, res: Response) {
  const companyId = req.companyId!;
  const userRole = req.userRole!;
  const employeeService = ServiceFactory.getService("employee", null, { companyId, role: userRole });
  const getUsers = await employeeService.getAll();
  res.status(httpStatusCode.OK).json({ users: getUsers });  
}

async function _raw_getEmployeeById(req: Request, res: Response) {
  const { employee_id: id } = req.params as { employee_id: string };
  const companyId = req.companyId!;
  const userRole = req.userRole!;
  const employeeService = ServiceFactory.getService("employee", null, { companyId, role: userRole });
  const employee = await employeeService.getById(id);
  res.status(httpStatusCode.OK).json({ user: employee });
}

async function _raw_createEmployee(req: Request, res: Response){
  const companyId = req.companyId!;
  const userRole = req.userRole!;
  const employeeService = ServiceFactory.getService("employee", null, { companyId, role: userRole });
  const employee = await employeeService.create({ ...req.body, companyId });
  auditLogService.log({ action: 'employee.created', entityType: 'Employee', entityId: employee?.id?.toString(), userId: req.userId, companyId, ipAddress: req.ip });
  res.status(httpStatusCode.OK).json({ user: employee });
}

async function _raw_deleteEmployee(req: Request, res: Response) {
  const { employee_id: id } = req.params as { employee_id: string };
  const companyId = req.companyId!;
  const userRole = req.userRole!;
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

async function _raw_updateEmployee(req: Request, res: Response) {
  const { employee_id: id } = req.params as { employee_id: string };
  const companyId = req.companyId!;
  const userRole = req.userRole!;
  const employeeService = ServiceFactory.getService("employee", null, { companyId, role: userRole });
  const updated = await employeeService.update(id, req.body);
  if (!updated) {
    return res.status(httpStatusCode.NOT_FOUND).json({ message: "Employee not found" });
  }
  auditLogService.log({ action: 'employee.updated', entityType: 'Employee', entityId: id, userId: req.userId, companyId, ipAddress: req.ip });
  res.status(httpStatusCode.OK).json({ user: updated });
}

const _handlers = { getAllEmployees: _raw_getAllEmployees, getEmployeeById: _raw_getEmployeeById, createEmployee: _raw_createEmployee, updateEmployee: _raw_updateEmployee, deleteEmployee: _raw_deleteEmployee };
const _proxied = proxyController(_handlers as any);
export const getAllEmployees = _proxied.getAllEmployees;
export const getEmployeeById = _proxied.getEmployeeById;
export const createEmployee = _proxied.createEmployee;
export const updateEmployee = _proxied.updateEmployee;
export const deleteEmployee = _proxied.deleteEmployee;
