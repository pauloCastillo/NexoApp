import { Request, Response } from 'express';
import { proxyController } from '@/utils/proxyController.js';
import { httpStatusCode } from '@/utils/httpStatus.js';
import ServiceFactory from '@/factories/serviceFactory.js';
import auditLogService from '@/services/auditLogService.js';

async function _raw_getAllClients(req: Request, res: Response) {
  const companyId = req.companyId!;
  const userRole = req.userRole!;
  const clientService = ServiceFactory.getService("client", null, { companyId, role: userRole });
  const clients = await clientService.getAll();
  res.status(httpStatusCode.OK).json({ clients });
}

async function _raw_createClient(req: Request, res: Response) {
  const companyId = req.companyId!;
  const userRole = req.userRole!;
  const clientData = { ...req.body, createdBy: req.userId, company: companyId };
  const clientService = ServiceFactory.getService("client", clientData, { companyId, role: userRole });
  const client = await clientService.create();
  auditLogService.log({ action: 'client.created', entityType: 'Client', entityId: client?._id?.toString(), userId: req.userId, companyId, ipAddress: req.ip });
  res.status(httpStatusCode.CREATED).json({ client });
}

async function _raw_updateClient(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const companyId = req.companyId!;
  const userRole = req.userRole!;
  const clientService = ServiceFactory.getService("client", req.body, { companyId, role: userRole });
  const updated = await clientService.update(id);
  if (!updated) {
    return res.status(httpStatusCode.NOT_FOUND).json({ message: "Client not found" });
  }
  auditLogService.log({ action: 'client.updated', entityType: 'Client', entityId: id, userId: req.userId, companyId, ipAddress: req.ip });
  res.status(httpStatusCode.OK).json({ client: updated });
}

async function _raw_deleteClient(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const companyId = req.companyId!;
  const userRole = req.userRole!;
  const clientService = ServiceFactory.getService("client", null, { companyId, role: userRole });
  const deleted = await clientService.delete(id);
  if (!deleted) {
    return res.status(httpStatusCode.NOT_FOUND).json({ message: "Client not found" });
  }
  auditLogService.log({ action: 'client.deleted', entityType: 'Client', entityId: id, userId: req.userId, companyId, ipAddress: req.ip });
  res.status(httpStatusCode.OK).json({ message: "Client deleted successfully" });
}

const _handlers = { getAllClients: _raw_getAllClients, createClient: _raw_createClient, updateClient: _raw_updateClient, deleteClient: _raw_deleteClient };
const _proxied: any = proxyController(_handlers as any);
export const getAllClients = _proxied.getAllClients;
export const createClient = _proxied.createClient;
export const updateClient = _proxied.updateClient;
export const deleteClient = _proxied.deleteClient;

