import { Request, Response } from 'express';
import { proxyController } from '@/utils/proxyController.js';
import { httpStatusCode } from '@/utils/httpStatus.js';
import ServiceFactory from '@/factories/serviceFactory.js';
import auditLogService from '@/services/auditLogService.js';

async function _raw_getWorkOrdersByEmployee(req: Request, res: Response) {
  const { employee_id } = req.params;
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const workOrderService = ServiceFactory.getService("workOrder", null, { companyId, role: userRole });
  const workOrders = await workOrderService.getByEmployee(employee_id);
  res.status(httpStatusCode.OK).json({ workOrders });
}

async function _raw_createWorkOrder(req: Request, res: Response) {
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const workOrderService = ServiceFactory.getService("workOrder", req.body, { companyId, role: userRole });
  const workOrder = await workOrderService.create();
  auditLogService.log({ action: 'workOrder.created', entityType: 'WorkOrder', entityId: workOrder?._id?.toString(), userId: req.userId, companyId, ipAddress: req.ip });
  res.status(httpStatusCode.CREATED).json({
    message: "Orden de trabajo registrada exitosamente",
    workOrder,
  });
}

async function _raw_updateWorkOrder(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const workOrderService = ServiceFactory.getService("workOrder", req.body, { companyId, role: userRole });
  const updated = await workOrderService.update(id);
  if (!updated) {
    return res.status(httpStatusCode.NOT_FOUND).json({ message: "Work order not found" });
  }
  auditLogService.log({ action: 'workOrder.updated', entityType: 'WorkOrder', entityId: id, userId: req.userId, companyId, ipAddress: req.ip });
  res.status(httpStatusCode.OK).json({ workOrder: updated });
}

async function _raw_deleteWorkOrder(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const workOrderService = ServiceFactory.getService("workOrder", null, { companyId, role: userRole });
  const deleted = await workOrderService.delete(id);
  if (!deleted) {
    return res.status(httpStatusCode.NOT_FOUND).json({ message: "Work order not found" });
  }
  auditLogService.log({ action: 'workOrder.deleted', entityType: 'WorkOrder', entityId: id, userId: req.userId, companyId, ipAddress: req.ip });
  res.status(httpStatusCode.OK).json({ message: "Work order deleted successfully" });
}

async function _raw_startWorkOrder(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  try {
    const workOrderService = ServiceFactory.getService("workOrder", null, { companyId, role: userRole });
    const updated = await workOrderService.start(id);
    auditLogService.log({ action: 'workOrder.started', entityType: 'WorkOrder', entityId: id, userId: req.userId, companyId, ipAddress: req.ip });
    res.status(httpStatusCode.OK).json({ message: "Orden iniciada", workOrder: updated });
  } catch (e: any) {
    res.status(httpStatusCode.BAD_REQUEST).json({ message: e.message });
  }
}

async function _raw_completeWorkOrder(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  try {
    const workOrderService = ServiceFactory.getService("workOrder", null, { companyId, role: userRole });
    const updated = await workOrderService.complete(id);
    auditLogService.log({ action: 'workOrder.completed', entityType: 'WorkOrder', entityId: id, userId: req.userId, companyId, ipAddress: req.ip });
    res.status(httpStatusCode.OK).json({ message: "Orden completada", workOrder: updated });
  } catch (e: any) {
    res.status(httpStatusCode.BAD_REQUEST).json({ message: e.message });
  }
}

async function _raw_cancelWorkOrder(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const { reason } = req.body;
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  try {
    const workOrderService = ServiceFactory.getService("workOrder", null, { companyId, role: userRole });
    const updated = await workOrderService.cancel(id, reason || '');
    auditLogService.log({ action: 'workOrder.cancelled', entityType: 'WorkOrder', entityId: id, userId: req.userId, companyId, metadata: { reason }, ipAddress: req.ip });
    res.status(httpStatusCode.OK).json({ message: "Orden cancelada", workOrder: updated });
  } catch (e: any) {
    res.status(httpStatusCode.BAD_REQUEST).json({ message: e.message });
  }
}

const _handlers = { getWorkOrdersByEmployee: _raw_getWorkOrdersByEmployee, createWorkOrder: _raw_createWorkOrder, updateWorkOrder: _raw_updateWorkOrder, deleteWorkOrder: _raw_deleteWorkOrder, startWorkOrder: _raw_startWorkOrder, completeWorkOrder: _raw_completeWorkOrder, cancelWorkOrder: _raw_cancelWorkOrder };
const _proxied: any = proxyController(_handlers as any);
export const getWorkOrdersByEmployee = _proxied.getWorkOrdersByEmployee;
export const createWorkOrder = _proxied.createWorkOrder;
export const updateWorkOrder = _proxied.updateWorkOrder;
export const deleteWorkOrder = _proxied.deleteWorkOrder;
export const startWorkOrder = _proxied.startWorkOrder;
export const completeWorkOrder = _proxied.completeWorkOrder;
export const cancelWorkOrder = _proxied.cancelWorkOrder;

