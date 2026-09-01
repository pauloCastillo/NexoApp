import { Request, Response } from 'express';
import { proxyController } from '@/utils/proxyController.js';
import { httpStatusCode } from '@/utils/httpStatus.js';
import ServiceFactory from '@/factories/serviceFactory.js';
import auditLogService from '@/services/auditLogService.js';

async function _raw_getVacationsByEmployee(req: Request, res: Response) {
  const { employee_id } = req.params;
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const vacationService = ServiceFactory.getService("vacation", null, { companyId, role: userRole });
  const vacations = await vacationService.getByEmployee(employee_id);
  res.status(httpStatusCode.OK).json({ vacations });
}

async function _raw_createVacation(req: Request, res: Response) {
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const vacationService = ServiceFactory.getService("vacation", req.body, { companyId, role: userRole });
  const vacation = await vacationService.create();
  auditLogService.log({ action: 'vacation.created', entityType: 'Vacation', entityId: vacation?._id?.toString(), userId: req.userId, companyId, ipAddress: req.ip });
  res.status(httpStatusCode.CREATED).json({
    message: "Solicitud de vacación enviada exitosamente",
    vacation,
  });
}

async function _raw_updateVacation(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  if (req.body.status && !['hr_manager', 'business_owner'].includes(userRole)) {
    return res.status(403).json({ message: 'Solo hr_manager o business_owner pueden aprobar' });
  }
  const vacationService = ServiceFactory.getService("vacation", req.body, { companyId, role: userRole });
  const updated = await vacationService.update(id);
  if (!updated) {
    return res.status(httpStatusCode.NOT_FOUND).json({ message: "Vacation not found" });
  }
  auditLogService.log({ action: 'vacation.updated', entityType: 'Vacation', entityId: id, userId: req.userId, companyId, ipAddress: req.ip });
  res.status(httpStatusCode.OK).json({ vacation: updated });
}

async function _raw_deleteVacation(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const vacationService = ServiceFactory.getService("vacation", null, { companyId, role: userRole });
  const deleted = await vacationService.delete(id);
  if (!deleted) {
    return res.status(httpStatusCode.NOT_FOUND).json({ message: "Vacation not found" });
  }
  auditLogService.log({ action: 'vacation.deleted', entityType: 'Vacation', entityId: id, userId: req.userId, companyId, ipAddress: req.ip });
  res.status(httpStatusCode.OK).json({ message: "Vacation deleted successfully" });
}

const _handlers = { getVacationsByEmployee: _raw_getVacationsByEmployee, createVacation: _raw_createVacation, updateVacation: _raw_updateVacation, deleteVacation: _raw_deleteVacation };
const _proxied: any = proxyController(_handlers as any);
export const getVacationsByEmployee = _proxied.getVacationsByEmployee;
export const createVacation = _proxied.createVacation;
export const updateVacation = _proxied.updateVacation;
export const deleteVacation = _proxied.deleteVacation;

