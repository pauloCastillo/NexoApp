import { Request, Response } from 'express';
import { proxyController } from '@/utils/proxyController.js';
import { httpStatusCode } from '@/utils/httpStatus.js';
import auditLogService from '@/services/auditLogService.js';

async function _raw_getAuditLogs(req: Request, res: Response) {
  const companyId = req.query.company as string | undefined;
  const context = { companyId: req.companyId!, role: req.userRole! };
  if (context.role !== 'superuser' && companyId && companyId !== context.companyId) {
    return res.status(httpStatusCode.FORBIDDEN).json({ message: "Acceso denegado" });
  }
  const logs = await auditLogService.query(companyId, context);
  res.status(httpStatusCode.OK).json({ logs });
}

const _handlers = { getAuditLogs: _raw_getAuditLogs };
const _proxied: any = proxyController(_handlers as any);
export const getAuditLogs = _proxied.getAuditLogs;
