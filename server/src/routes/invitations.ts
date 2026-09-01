import express from 'express';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import { verifiedToken } from '@/middlewares/verifyToken.js';
import { requireRole } from '@/middlewares/tenantGuard.js';
import { Invitation, Company, Department, Branch } from '@/db/models/index.js';
import { createInvitationSchema, requestNewSchema } from '@/schemas/invitation.js';
import auditLogService from '@/services/auditLogService.js';
import { getIO } from '@/utils/socketManager.js';
import logger from '@/utils/logger.js';

const router = express.Router();

// throttle for validate: 10/min/IP
const validateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiadas validaciones, intenta en 1 minuto', canRequestNew: true },
});

// POST /api/invitations — crear código enriquecido
router.post('/', verifiedToken, requireRole('business_owner', 'admin', 'hr_manager', 'supervisor'), async (req: any, res) => {
  try {
    const parsed = createInvitationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() });
    const { role, maxUses, expiresInDays, username, email, phone, jobTitle, targetEmail, targetPhone, departmentId, branchId, shiftId, shiftLabel } = parsed.data;
    const companyId = req.companyId;
    if (!companyId) return res.status(400).json({ message: 'Empresa no encontrada en token' });

    // validate department/branch belong to company if provided
    if (departmentId) {
      const dept = await Department.findOne({ _id: departmentId, company: companyId });
      if (!dept) return res.status(400).json({ message: 'Departamento no pertenece a la empresa' });
    }
    if (branchId) {
      // branchId can be ObjectId or string label fallback
      const isObjectId = /^[a-f\d]{24}$/i.test(branchId);
      if (isObjectId) {
        const br = await Branch.findOne({ _id: branchId, company: companyId });
        if (!br) return res.status(400).json({ message: 'Sucursal no pertenece a la empresa' });
      }
    }

    const code = crypto.randomBytes(6).toString('hex').toUpperCase();
    const expiresAt = new Date(Date.now() + (expiresInDays ?? 7) * 24 * 60 * 60 * 1000);
    const isObjectIdBranch = branchId && /^[a-f\d]{24}$/i.test(branchId);

    const inv = await Invitation.create({
      code,
      company: companyId,
      createdBy: req.userId,
      role,
      maxUses: maxUses ?? 1,
      expiresAt,
      invitedName: String(username).trim(),
      invitedEmail: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : undefined,
      jobTitle: jobTitle ? String(jobTitle).trim() : undefined,
      targetEmail: targetEmail ? String(targetEmail).trim().toLowerCase() : undefined,
      targetPhone: targetPhone ? String(targetPhone).trim() : undefined,
      department: departmentId || undefined,
      branchId: isObjectIdBranch ? branchId : undefined,
      branch: !isObjectIdBranch && branchId ? String(branchId).trim() : undefined,
      shiftId: shiftId ? String(shiftId).trim() : undefined,
      shiftLabel: shiftLabel ? String(shiftLabel).trim() : (shiftId ? String(shiftId).trim() : undefined),
    });

    // optional QR data URL: ponytail client generates, but provide link
    const inviteLink = `https://nexo.app/invite/${code}`;
    const waText = encodeURIComponent(`Únete a ${(await Company.findById(companyId).lean() as any)?.name ?? 'Nexo'} en Nexo: ${inviteLink}  Código: ${code}`);
    const waLink = `https://wa.me/?text=${waText}`;

    await auditLogService.log({ action: 'invitation.created', entityType: 'Invitation', entityId: code, userId: req.userId, companyId: String(companyId), newValue: { code, role, departmentId, branchId }, ipAddress: req.ip });

    const company = await Company.findById(companyId).lean();
    return res.status(201).json({ code: inv.code, company: { id: companyId, name: (company as any)?.name }, role: inv.role, expiresAt: inv.expiresAt, maxUses: inv.maxUses, invitedName: inv.get('invitedName'), invitedEmail: inv.get('invitedEmail'), inviteLink, waLink });
  } catch (err: any) {
    if (err.code === 11000) return res.status(409).json({ message: 'Error generando código, reintenta' });
    logger.error({ err }, 'POST /invitations failed');
    return res.status(500).json({ message: err.message || 'Error creando invitación' });
  }
});

// GET /api/invitations/validate/:code — público throttled, respuesta unificada
router.get('/validate/:code', validateLimiter, async (req, res) => {
  try {
    const code = String(req.params.code || '').toUpperCase().trim();
    const inv = await Invitation.findOne({ code }).populate('company', 'name').populate('department', 'name').lean() as any;
    // unified 400 for any invalid state to avoid enumeration
    if (!inv || !inv.isActive || (inv.expiresAt && new Date(inv.expiresAt) < new Date()) || inv.usedCount >= inv.maxUses) {
      return res.status(400).json({ message: 'Código inválido o expirado', canRequestNew: true });
    }
    // resolve branch preview
    let branchPreview: any = undefined;
    if (inv.branchId) {
      const br = await Branch.findById(inv.branchId).lean() as any;
      if (br) branchPreview = { id: String(br._id), name: br.name };
    } else if (inv.branch) {
      branchPreview = { name: inv.branch };
    }
    let deptPreview: any = undefined;
    if (inv.department && typeof inv.department === 'object' && inv.department.name) deptPreview = { id: String(inv.department._id), name: inv.department.name };
    else if (inv.department) {
      const d = await Department.findById(inv.department).lean() as any;
      if (d) deptPreview = { id: String(d._id), name: d.name };
    }
    return res.json({ valid: true, company: { id: inv.company._id ?? inv.company, name: inv.company.name ?? inv.company }, department: deptPreview, branch: branchPreview, shift: inv.shiftLabel || inv.shiftId || undefined, role: inv.role, expiresAt: inv.expiresAt });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Error validando código' });
  }
});

// POST /api/invitations/request-new — público genérico
router.post('/request-new', async (req, res) => {
  try {
    const parsed = requestNewSchema.safeParse(req.body);
    if (!parsed.success) {
      // still return generic 200 to avoid enumeration, but log
      return res.json({ message: 'Si el código existe, el administrador fue notificado' });
    }
    const { code, email, phone } = parsed.data;
    const upper = code.toUpperCase().trim();
    const inv = await Invitation.findOne({ code: upper }).lean() as any;
    if (inv) {
      await Invitation.updateOne({ code: upper }, { $set: { requestedNewAt: new Date() } });
      await auditLogService.log({ action: 'invitation.request_new', entityType: 'Invitation', entityId: upper, companyId: String(inv.company), metadata: { email, phone }, ipAddress: req.ip });
      try {
        getIO().of('/api/dashboard').emit('invitation:request_new', { code: upper, email, phone, company: String(inv.company) });
      } catch (e) {
        logger.warn({ err: e }, 'socket emit invitation:request_new failed');
      }
    } else {
      // keep audit trail for miss without enumeration (no TTL delete)
      await auditLogService.log({ action: 'invitation.request_new.miss', entityType: 'Invitation', entityId: upper, metadata: { email, phone }, ipAddress: req.ip });
    }
    return res.json({ message: 'Si el código existe, el administrador fue notificado' });
  } catch (_err: any) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return res.json({ message: 'Si el código existe, el administrador fue notificado' });
  }
});

// GET /api/invitations — listar de mi empresa
router.get('/', verifiedToken, requireRole('business_owner', 'admin', 'hr_manager', 'supervisor'), async (req: any, res) => {
  try {
    const list = await Invitation.find({ company: req.companyId, isActive: true }).sort({ createdAt: -1 }).lean();
    return res.json(list.map((i: any) => ({ code: i.code, role: i.role, usedCount: i.usedCount, maxUses: i.maxUses, expiresAt: i.expiresAt, createdAt: i.createdAt, invitedName: i.invitedName, invitedEmail: i.invitedEmail, phone: i.phone, jobTitle: i.jobTitle, targetEmail: i.targetEmail, targetPhone: i.targetPhone, department: i.department, branchId: i.branchId, branch: i.branch, shiftLabel: i.shiftLabel, shiftId: i.shiftId })));
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// DELETE /api/invitations/:code — revocar (supervisor incluido per spec)
router.delete('/:code', verifiedToken, requireRole('business_owner', 'admin', 'hr_manager', 'supervisor'), async (req: any, res) => {
  try {
    const code = String(req.params.code || '').toUpperCase();
    const inv = await Invitation.findOneAndUpdate({ code, company: req.companyId }, { isActive: false }, { new: true });
    if (!inv) return res.status(404).json({ message: 'No encontrado' });
    await auditLogService.log({ action: 'invitation.revoked', entityType: 'Invitation', entityId: code, userId: req.userId, companyId: String(req.companyId), ipAddress: req.ip });
    return res.json({ message: 'Revocado' });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

export { router };
