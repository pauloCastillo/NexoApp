import { Request, Response } from 'express';
import { proxyController } from '@/utils/proxyController.js';
import { httpStatusCode } from '@/utils/httpStatus.js';
import { Branch, Company } from '@/db/models/index.js';
import { createBranchSchema, updateBranchSchema } from '@/schemas/branch.js';
import auditLogService from '@/services/auditLogService.js';

const CAN_EDIT = ['business_owner', 'admin', 'supervisor', 'superuser', 'platform_admin'];
const CAN_VIEW = ['business_owner', 'admin', 'supervisor', 'superuser', 'platform_admin', 'hr_manager'];

async function _raw_listBranches(req: Request, res: Response) {
  const companyId = req.companyId!;
  const role = req.userRole!;
  if (!CAN_VIEW.includes(role)) return res.status(httpStatusCode.FORBIDDEN).json({ message: 'Acceso denegado' });
  const filter: any = { isActive: true };
  if (role !== 'superuser') filter.company = companyId;
  else if (req.query.company) filter.company = req.query.company;
  const branches = await Branch.find(filter).sort({ createdAt: -1 });
  res.status(httpStatusCode.OK).json({ branches });
}

async function _raw_getBranch(req: Request, res: Response) {
  const role = req.userRole!;
  if (!CAN_VIEW.includes(role)) return res.status(httpStatusCode.FORBIDDEN).json({ message: 'Acceso denegado' });
  const branch = await Branch.findById(req.params.id);
  if (!branch) return res.status(httpStatusCode.NOT_FOUND).json({ message: 'Sucursal no encontrada' });
  if (role !== 'superuser' && String(branch.company) !== String(req.companyId!)) return res.status(httpStatusCode.FORBIDDEN).json({ message: 'Acceso denegado' });
  res.status(httpStatusCode.OK).json({ branch });
}

async function _raw_createBranch(req: Request, res: Response) {
  const role = req.userRole!;
  const companyId = req.companyId!;
  if (!CAN_EDIT.includes(role)) return res.status(httpStatusCode.FORBIDDEN).json({ message: 'Acceso denegado: solo supervisor y business_owner pueden editar' });
  const parsed = createBranchSchema.safeParse(req.body);
  if (!parsed.success) return res.status(httpStatusCode.BAD_REQUEST).json({ message: 'Datos inválidos', errors: parsed.error.flatten() });
  const company = await Company.findById(companyId);
  if (!company) return res.status(httpStatusCode.NOT_FOUND).json({ message: 'Empresa no encontrada' });
  const count = await Branch.countDocuments({ company: companyId, isActive: true });
  if (count >= 20) return res.status(httpStatusCode.BAD_REQUEST).json({ message: 'Límite de 20 sucursales alcanzado' });
  const branch = await Branch.create({ ...parsed.data, company: companyId, createdBy: req.userId! });
  await auditLogService.log({ action: 'branch.create', entityType: 'Branch', entityId: String(branch._id), userId: req.userId!, companyId: String(companyId), newValue: branch.toObject(), metadata: { reason: parsed.data.reason }, ipAddress: req.ip });
  res.status(httpStatusCode.CREATED).json({ branch });
}

async function _raw_updateBranch(req: Request, res: Response) {
  const role = req.userRole!;
  const companyId = req.companyId!;
  if (!CAN_EDIT.includes(role)) return res.status(httpStatusCode.FORBIDDEN).json({ message: 'Acceso denegado: solo supervisor y business_owner pueden editar' });
  const parsed = updateBranchSchema.safeParse(req.body);
  if (!parsed.success) return res.status(httpStatusCode.BAD_REQUEST).json({ message: 'Datos inválidos', errors: parsed.error.flatten() });
  const branch = await Branch.findById(req.params.id);
  if (!branch) return res.status(httpStatusCode.NOT_FOUND).json({ message: 'Sucursal no encontrada' });
  if (role !== 'superuser' && String(branch.company) !== String(companyId)) return res.status(httpStatusCode.FORBIDDEN).json({ message: 'Acceso denegado' });
  const isMoving = parsed.data.location || parsed.data.geofenceRadius !== undefined;
  if (isMoving && !parsed.data.reason) return res.status(httpStatusCode.BAD_REQUEST).json({ message: 'Motivo requerido al mover geocerca o cambiar radio' });
  const prev = branch.toObject();
  if (parsed.data.name !== undefined) branch.name = parsed.data.name;
  if (parsed.data.address !== undefined) branch.address = parsed.data.address;
  if (parsed.data.location) branch.location = parsed.data.location;
  if (parsed.data.geofenceRadius !== undefined) branch.geofenceRadius = parsed.data.geofenceRadius;
  await branch.save();
  await auditLogService.log({ action: 'branch.update', entityType: 'Branch', entityId: String(branch._id), userId: req.userId!, companyId: String(companyId), previousValue: prev, newValue: branch.toObject(), metadata: { reason: parsed.data.reason }, ipAddress: req.ip });
  res.status(httpStatusCode.OK).json({ branch });
}

async function _raw_deleteBranch(req: Request, res: Response) {
  const role = req.userRole!;
  const companyId = req.companyId!;
  if (!CAN_EDIT.includes(role)) return res.status(httpStatusCode.FORBIDDEN).json({ message: 'Acceso denegado' });
  const branch = await Branch.findById(req.params.id);
  if (!branch) return res.status(httpStatusCode.NOT_FOUND).json({ message: 'Sucursal no encontrada' });
  if (role !== 'superuser' && String(branch.company) !== String(companyId)) return res.status(httpStatusCode.FORBIDDEN).json({ message: 'Acceso denegado' });
  const prev = branch.toObject();
  branch.isActive = false;
  await branch.save();
  await auditLogService.log({ action: 'branch.delete', entityType: 'Branch', entityId: String(branch._id), userId: req.userId!, companyId: String(companyId), previousValue: prev, newValue: branch.toObject(), ipAddress: req.ip });
  res.status(httpStatusCode.OK).json({ message: 'Sucursal desactivada', branch });
}

const _handlers = { listBranches: _raw_listBranches, getBranch: _raw_getBranch, createBranch: _raw_createBranch, updateBranch: _raw_updateBranch, deleteBranch: _raw_deleteBranch };
const _proxied: any = proxyController(_handlers as any);
export const listBranches = _proxied.listBranches;
export const getBranch = _proxied.getBranch;
export const createBranch = _proxied.createBranch;
export const updateBranch = _proxied.updateBranch;
export const deleteBranch = _proxied.deleteBranch;
