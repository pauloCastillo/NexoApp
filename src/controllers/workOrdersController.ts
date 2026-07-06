import { Request, Response } from 'express';
import { httpStatusCode } from '@/utils/httpStatus.js';
import ServiceFactory from '@/factories/serviceFactory.js';
import auditLogService from '@/services/auditLogService.js';

async function getWorkOrdersByEmployee(req: Request, res: Response) {
  const { employee_id } = req.params;
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const userType = (req as any).userType;
  const workOrderService = ServiceFactory.getService("workOrder", null, { companyId, role: userRole, userType });
  const workOrders = await workOrderService.getByEmployee(employee_id);
  res.status(httpStatusCode.OK).json({ workOrders });
}

async function createWorkOrder(req: Request, res: Response) {
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const userType = (req as any).userType;
  const workOrderService = ServiceFactory.getService("workOrder", req.body, { companyId, role: userRole, userType });
  const workOrder = await workOrderService.create();
  auditLogService.log({ action: 'workOrder.created', entityType: 'WorkOrder', entityId: workOrder?._id?.toString(), userId: req.employeeId, companyId, ipAddress: req.ip });
  res.status(httpStatusCode.CREATED).json({
    message: "Orden de trabajo registrada exitosamente",
    workOrder,
  });
}

async function updateWorkOrder(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const userType = (req as any).userType;
  const workOrderService = ServiceFactory.getService("workOrder", req.body, { companyId, role: userRole, userType });
  const updated = await workOrderService.update(id);
  if (!updated) {
    return res.status(httpStatusCode.NOT_FOUND).json({ message: "Work order not found" });
  }
  auditLogService.log({ action: 'workOrder.updated', entityType: 'WorkOrder', entityId: id, userId: req.employeeId, companyId, ipAddress: req.ip });
  res.status(httpStatusCode.OK).json({ workOrder: updated });
}

async function deleteWorkOrder(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const userType = (req as any).userType;
  const workOrderService = ServiceFactory.getService("workOrder", null, { companyId, role: userRole, userType });
  const deleted = await workOrderService.delete(id);
  if (!deleted) {
    return res.status(httpStatusCode.NOT_FOUND).json({ message: "Work order not found" });
  }
  auditLogService.log({ action: 'workOrder.deleted', entityType: 'WorkOrder', entityId: id, userId: req.employeeId, companyId, ipAddress: req.ip });
  res.status(httpStatusCode.OK).json({ message: "Work order deleted successfully" });
}

async function startWorkOrder(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const userType = (req as any).userType;
  try {
    const workOrderService = ServiceFactory.getService("workOrder", null, { companyId, role: userRole, userType });
    const updated = await workOrderService.start(id);
    auditLogService.log({ action: 'workOrder.started', entityType: 'WorkOrder', entityId: id, userId: req.employeeId, companyId, ipAddress: req.ip });
    res.status(httpStatusCode.OK).json({ message: "Orden iniciada", workOrder: updated });
  } catch (e: any) {
    res.status(httpStatusCode.BAD_REQUEST).json({ message: e.message });
  }
}

async function completeWorkOrder(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const userType = (req as any).userType;
  try {
    const workOrderService = ServiceFactory.getService("workOrder", null, { companyId, role: userRole, userType });
    const updated = await workOrderService.complete(id);
    auditLogService.log({ action: 'workOrder.completed', entityType: 'WorkOrder', entityId: id, userId: req.employeeId, companyId, ipAddress: req.ip });
    res.status(httpStatusCode.OK).json({ message: "Orden completada", workOrder: updated });
  } catch (e: any) {
    res.status(httpStatusCode.BAD_REQUEST).json({ message: e.message });
  }
}

async function cancelWorkOrder(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const { reason } = req.body;
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const userType = (req as any).userType;
  try {
    const workOrderService = ServiceFactory.getService("workOrder", null, { companyId, role: userRole, userType });
    const updated = await workOrderService.cancel(id, reason || '');
    auditLogService.log({ action: 'workOrder.cancelled', entityType: 'WorkOrder', entityId: id, userId: req.employeeId, companyId, metadata: { reason }, ipAddress: req.ip });
    res.status(httpStatusCode.OK).json({ message: "Orden cancelada", workOrder: updated });
  } catch (e: any) {
    res.status(httpStatusCode.BAD_REQUEST).json({ message: e.message });
  }
}

export { getWorkOrdersByEmployee, createWorkOrder, updateWorkOrder, deleteWorkOrder, startWorkOrder, completeWorkOrder, cancelWorkOrder };
