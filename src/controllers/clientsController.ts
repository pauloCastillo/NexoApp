import { Request, Response } from 'express';
import { httpStatusCode } from '@/utils/httpStatus.js';
import ServiceFactory from '@/factories/serviceFactory.js';

async function getAllClients(req: Request, res: Response) {
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const userType = (req as any).userType;
  const clientService = ServiceFactory.getService("client", null, { companyId, role: userRole, userType });
  const clients = await clientService.getAll();
  res.status(httpStatusCode.OK).json({ clients });
}

async function createClient(req: Request, res: Response) {
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const userType = (req as any).userType;
  const clientData = { ...req.body, createdBy: req.employeeId, company: companyId };
  const clientService = ServiceFactory.getService("client", clientData, { companyId, role: userRole, userType });
  const client = await clientService.create();
  res.status(httpStatusCode.CREATED).json({ client });
}

export { getAllClients, createClient,  };
