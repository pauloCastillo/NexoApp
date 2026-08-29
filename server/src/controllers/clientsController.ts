import { Request, Response } from 'express';
import { httpStatusCode } from '@/utils/httpStatus.js';
import ServiceFactory from '@/factories/serviceFactory.js';
import auditLogService from '@/services/auditLogService.js';

async function getAllClients(req: Request, res: Response) {
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const clientService = ServiceFactory.getService("client", null, { companyId, role: userRole });
  const clients = await clientService.getAll();
  res.status(httpStatusCode.OK).json({ clients });
}

async function createClient(req: Request, res: Response) {
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const clientData = { ...req.body, createdBy: req.userId, company: companyId };
  const clientService = ServiceFactory.getService("client", clientData, { companyId, role: userRole });
  const client = await clientService.create();
  auditLogService.log({ action: 'client.created', entityType: 'Client', entityId: client?._id?.toString(), userId: req.userId, companyId, ipAddress: req.ip });
  res.status(httpStatusCode.CREATED).json({ client });
}

async function updateClient(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const clientService = ServiceFactory.getService("client", req.body, { companyId, role: userRole });
  const updated = await clientService.update(id);
  if (!updated) {
    return res.status(httpStatusCode.NOT_FOUND).json({ message: "Client not found" });
  }
  auditLogService.log({ action: 'client.updated', entityType: 'Client', entityId: id, userId: req.userId, companyId, ipAddress: req.ip });
  res.status(httpStatusCode.OK).json({ client: updated });
}

async function deleteClient(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const clientService = ServiceFactory.getService("client", null, { companyId, role: userRole });
  const deleted = await clientService.delete(id);
  if (!deleted) {
    return res.status(httpStatusCode.NOT_FOUND).json({ message: "Client not found" });
  }
  auditLogService.log({ action: 'client.deleted', entityType: 'Client', entityId: id, userId: req.userId, companyId, ipAddress: req.ip });
  res.status(httpStatusCode.OK).json({ message: "Client deleted successfully" });
}

export { getAllClients, createClient, updateClient, deleteClient };
