import { Request, Response } from 'express';
import { httpStatusCode } from '@/utils/httpStatus.js';
import auditLogService from '@/services/auditLogService.js';

async function getAuditLogs(req: Request, res: Response) {
  const companyId = req.query.company as string | undefined;
  const context = { companyId: (req as any).companyId, role: (req as any).userRole, userType: (req as any).userType };
  if (context.role !== 'superuser' && companyId && companyId !== context.companyId) {
    return res.status(httpStatusCode.FORBIDDEN).json({ message: "Acceso denegado" });
  }
  const logs = await auditLogService.query(companyId, context);
  res.status(httpStatusCode.OK).json({ logs });
}

export { getAuditLogs };