import { Request, Response } from 'express';
import { httpStatusCode } from '@/utils/httpStatus.js';
import ServiceFactory from '@/factories/serviceFactory.js';

async function getPermissionsByEmployee(req: Request, res: Response) {
  const { employee_id } = req.params;
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const userType = (req as any).userType;
  const permissionService = ServiceFactory.getService("permission", null, { companyId, role: userRole, userType });
  const permissions = await permissionService.getByEmployee(employee_id);
  res.status(httpStatusCode.OK).json({ permissions });
}

async function createPermission(req: Request, res: Response) {
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const userType = (req as any).userType;
  const permissionService = ServiceFactory.getService("permission", req.body, { companyId, role: userRole, userType });
  const permission = await permissionService.create();
  res.status(httpStatusCode.CREATED).json({
    message: "Permiso solicitado exitosamente",
    permission,
  });
}

export { getPermissionsByEmployee, createPermission,  };
