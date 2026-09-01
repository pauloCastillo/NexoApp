import { Request, Response } from 'express';
import { proxyController } from '@/utils/proxyController.js';
import { httpStatusCode } from '@/utils/httpStatus.js';
import { User, Branch } from '@/db/models/index.js';
import { assignBranchesSchema } from '@/schemas/branch.js';
import auditLogService from '@/services/auditLogService.js';

const CAN_EDIT = ['business_owner', 'admin', 'supervisor', 'superuser', 'platform_admin'];

async function _raw_assignBranches(req: Request, res: Response) {
  const role = (req as any).userRole;
  const companyId = (req as any).companyId;
  if (!CAN_EDIT.includes(role)) return res.status(httpStatusCode.FORBIDDEN).json({ message: 'Acceso denegado: solo supervisor y business_owner pueden asignar zonas' });
  const parsed = assignBranchesSchema.safeParse(req.body);
  if (!parsed.success) return res.status(httpStatusCode.BAD_REQUEST).json({ message: 'Datos inválidos', errors: parsed.error.flatten() });
  const employee = await User.findById(req.params.employee_id);
  if (!employee) return res.status(httpStatusCode.NOT_FOUND).json({ message: 'Empleado no encontrado' });
  if (role !== 'superuser' && String(employee.company) !== String(companyId)) return res.status(httpStatusCode.FORBIDDEN).json({ message: 'Acceso denegado' });
  if (parsed.data.branchIds.length > 0) {
    const branches = await Branch.find({ _id: { $in: parsed.data.branchIds }, company: employee.company, isActive: true });
    if (branches.length !== parsed.data.branchIds.length) return res.status(httpStatusCode.BAD_REQUEST).json({ message: 'Alguna sucursal no existe o no pertenece a la empresa' });
  }
  const prev = (employee as any).branches?.map((b: any) => String(b)) || [];
  (employee as any).branches = parsed.data.branchIds;
  await employee.save();
  await auditLogService.log({ action: 'employee.branches.assigned', entityType: 'User', entityId: String(employee._id), userId: (req as any).userId, companyId: String(employee.company ?? companyId), previousValue: { branches: prev }, newValue: { branches: parsed.data.branchIds }, metadata: { reason: parsed.data.reason }, ipAddress: req.ip });
  const populated = await User.findById(employee._id).populate('branches');
  res.status(httpStatusCode.OK).json({ user: populated });
}

const _handlers = { assignBranches: _raw_assignBranches };
const _proxied: any = proxyController(_handlers as any);
export const assignBranches = _proxied.assignBranches;
