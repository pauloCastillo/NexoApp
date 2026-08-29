import { Request, Response } from 'express';
import { httpStatusCode } from '@/utils/httpStatus.js';
import ServiceFactory from '@/factories/serviceFactory.js';
import auditLogService from '@/services/auditLogService.js';

async function getPermissionsByEmployee(req: Request, res: Response) {
  const { employee_id } = req.params;
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const permissionService = ServiceFactory.getService("permission", null, { companyId, role: userRole });
  const permissions = await permissionService.getByEmployee(employee_id);
  res.status(httpStatusCode.OK).json({ permissions });
}

async function createPermission(req: Request, res: Response) {
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const permissionService = ServiceFactory.getService("permission", req.body, { companyId, role: userRole });
  const permission = await permissionService.create();
  auditLogService.log({ action: 'permission.created', entityType: 'Permission', entityId: permission?._id?.toString(), userId: req.userId, companyId, ipAddress: req.ip });
  res.status(httpStatusCode.CREATED).json({
    message: "Permiso solicitado exitosamente",
    permission,
  });
}

async function updatePermission(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  // only hr_manager / business_owner can approve
  if (req.body.status && !['hr_manager', 'business_owner'].includes(userRole)) {
    return res.status(403).json({ message: 'Solo hr_manager o business_owner pueden aprobar' });
  }
  const permissionService = ServiceFactory.getService("permission", req.body, { companyId, role: userRole });
  const updated = await permissionService.update(id);
  if (!updated) {
    return res.status(httpStatusCode.NOT_FOUND).json({ message: "Permission not found" });
  }
  auditLogService.log({ action: 'permission.updated', entityType: 'Permission', entityId: id, userId: req.userId, companyId, ipAddress: req.ip });
  res.status(httpStatusCode.OK).json({ permission: updated });
}

async function deletePermission(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const permissionService = ServiceFactory.getService("permission", null, { companyId, role: userRole });
  const deleted = await permissionService.delete(id);
  if (!deleted) {
    return res.status(httpStatusCode.NOT_FOUND).json({ message: "Permission not found" });
  }
  auditLogService.log({ action: 'permission.deleted', entityType: 'Permission', entityId: id, userId: req.userId, companyId, ipAddress: req.ip });
  res.status(httpStatusCode.OK).json({ message: "Permission deleted successfully" });
}

export { getPermissionsByEmployee, createPermission, updatePermission, deletePermission };
