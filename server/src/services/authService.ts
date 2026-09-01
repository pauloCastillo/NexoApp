// ponytail: legacy throw {statusCode, message} — normalized via normalizeError, migrate to AppError on next touch
import { checkingPassword, signSession, signRefreshToken, hashToken, verifyTokenHash } from '@/utils/utils.js';
import { User, Company } from '@/db/models/index.js';
import auditLogService from '@/services/auditLogService.js';
import jwt from 'jsonwebtoken';
import { registerOwnerSchema } from '@/schemas/auth.js';

class AuthService {
  async registerOwner(body: any) {
    const { email, password, confirmPassword } = body;

    if (confirmPassword !== password) {
      throw { statusCode: 400, message: "Las contraseñas no coinciden" };
    }

    const existing = await User.findOne({ email });
    if (existing) {
      throw { statusCode: 409, message: "Ya existe un usuario registrado con esos datos, inicie sesión si es usted" };
    }

    const parsed = registerOwnerSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((e) => ({ field: e.path.join('.'), message: e.message }));
      throw { statusCode: 400, message: 'Datos inválidos', errors };
    }

    const { username: ownerName, email: ownerEmail, password: ownerPassword, companyName: ownerCompanyName, phone: ownerPhone } = parsed.data;

    const existingCompany = await Company.findOne({ name: new RegExp(`^${ownerCompanyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
    if (existingCompany) {
      throw { statusCode: 409, message: "La empresa ya está registrada" };
    }

    // ponytail: atomic Company+User creation (see auditoria #8)
    const mongoose = (await import('mongoose')).default;
    const session = await mongoose.startSession();
    let newCompany: any;
    let owner: any;
    try {
      await session.withTransaction(async () => {
        const c = await Company.create([{ name: ownerCompanyName.trim() }], { session });
        newCompany = c[0];
        const u = await User.create([{ username: ownerName, email: ownerEmail, password: ownerPassword, phone: ownerPhone, role: 'business_owner', company: newCompany._id }], { session });
        owner = u[0];
      });
    } finally {
      await session.endSession();
    }
    const userData = { _id: owner._id, email: owner.email, username: owner.username, company: newCompany._id, role: 'business_owner' };
    const token = signSession(userData);
    const refreshToken = signRefreshToken(userData);
    owner.refreshTokenHash = await hashToken(refreshToken);
    await owner.save();

    auditLogService.log({ action: 'auth.register_owner', entityType: 'User', entityId: owner._id.toString(), companyId: newCompany._id.toString() });

    return {
      message: "Registro exitoso",
      user: { id: owner._id, username: owner.username, email: owner.email, role: owner.role },
      company: { id: newCompany._id, name: newCompany.name },
      token, refreshToken,
    };
  }

  async registerUser(body: any) {
    const { email, password, confirmPassword, username, companyName, phone, jobTitle, role, invitationCode } = body;

    if (confirmPassword !== password) {
      throw { statusCode: 400, message: "Las contraseñas no coinciden" };
    }
    if (!password || String(password).length < 6) {
      throw { statusCode: 400, message: "La contraseña debe tener al menos 6 caracteres" };
    }

    const existing = await User.findOne({ email });
    if (existing) {
      throw { statusCode: 409, message: "Ya existe un usuario registrado con esos datos, inicie sesión si es usted" };
    }

    // ponytail: invitationCode determines role, legacy flag removed
    let company: any;
    let finalRole = role || 'employee';

    if (invitationCode) {
      const { Invitation } = await import('@/db/models/index.js');
      const code = String(invitationCode).toUpperCase().trim();
      // atomic single-use consume
      const inv: any = await Invitation.findOneAndUpdate(
        { code, isActive: true, $expr: { $lt: ['$usedCount', '$maxUses'] }, $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: { $exists: false } }] },
        { $inc: { usedCount: 1 }, $set: { usedBy: undefined, usedAt: new Date(), isActive: false } },
        { new: true }
      );
      if (!inv) {
        const exists = await Invitation.findOne({ code });
        if (exists) throw { statusCode: 400, code: 'INVITATION_INVALID', message: "Código inválido o expirado" };
        throw { statusCode: 400, code: 'INVITATION_INVALID', message: "Código inválido o expirado" };
      }
      if (inv.expiresAt && new Date(inv.expiresAt) < new Date()) throw { statusCode: 400, code: 'INVITATION_INVALID', message: "Código inválido o expirado" };
      company = await Company.findById(inv.company);
      if (!company) throw { statusCode: 404, message: "Empresa de la invitación no encontrada" };
      finalRole = inv.role || 'employee';
      (body as any)._invitation = inv;
    } else {
      // legacy: allow employee by companyName for backwards compat, but prefer invitation
      const normalizedName = companyName?.trim();
      if (!normalizedName) {
        throw { statusCode: 400, message: "Código de invitación requerido para colaboradores. Solicítalo a tu administrador." };
      }
      let found = await Company.findOne({ name: new RegExp(`^${normalizedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
      if (!found) {
        found = await Company.create({ name: normalizedName });
      }
      company = found;
    }

    const invMeta: any = (body as any)._invitation;
    const userPayload: any = { username, email, password, phone, role: finalRole, company: company._id, jobTitle };
    if (invMeta) {
      if (invMeta.department) userPayload.department = invMeta.department;
      if (invMeta.branchId) userPayload.branches = [invMeta.branchId];
      else if (invMeta.branch) userPayload.branches = []; // string fallback, keep empty but log
      // update usedBy now that user id known? will set after create via update
    }
    const user = await User.create(userPayload);
    if (invMeta) {
      await (await import('@/db/models/index.js')).Invitation.updateOne({ _id: invMeta._id }, { $set: { usedBy: user._id, usedAt: new Date() } });
      await auditLogService.log({ action: 'invitation.consumed', entityType: 'Invitation', entityId: invMeta.code, userId: user._id.toString(), companyId: company._id.toString(), metadata: { role: finalRole, department: invMeta.department, branchId: invMeta.branchId, branch: invMeta.branch } });
    }
    const userData = { _id: user._id, email: user.email, username: user.username, company: company._id, role: user.role };
    const token = signSession(userData);
    const refreshToken = signRefreshToken(userData);
    user.refreshTokenHash = await hashToken(refreshToken);
    await user.save();

    auditLogService.log({ action: 'auth.register', entityType: 'User', entityId: user._id.toString(), companyId: company._id.toString(), metadata: invMeta ? { invitationCode: invMeta.code } : undefined });

    return {
      message: "Registro exitoso",
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
      companyId: company._id.toString(),
      token, refreshToken,
    };
  }

  async login(body: any) {
    const { email, password } = body;
    if (!email || !password) {
      throw { statusCode: 400, message: "Correo y contraseña requeridos" };
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      auditLogService.log({ action: 'auth.login_failed', entityType: 'User', metadata: { email, reason: 'not_found' } });
      throw { statusCode: 404, message: "Usuario no encontrado" };
    }

    const isValid = await checkingPassword(password, user.password);
    if (!isValid) {
      auditLogService.log({ action: 'auth.login_failed', entityType: 'User', entityId: user._id.toString(), metadata: { email, reason: 'wrong_password' } });
      throw { statusCode: 401, message: "Contraseña incorrecta" };
    }

    const userData = {
      _id: user._id,
      email: user.email,
      username: user.username,
      company: user.company || null,
      role: user.role,
    };
    const token = signSession(userData);
    const refreshToken = signRefreshToken(userData);
    user.refreshTokenHash = await hashToken(refreshToken);
    await user.save();

    auditLogService.log({ action: 'auth.login', entityType: 'User', entityId: user._id.toString(), userId: user._id.toString(), companyId: user.company?.toString() });

    return {
      message: "Bienvenido(a) " + user.username,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
      token, refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw { statusCode: 400, message: "Refresh token requerido" };
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY!) as Record<string, any>;
      if (decoded.type !== 'refresh') {
        throw { statusCode: 401, message: "Token inválido" };
      }

      const user = await User.findById(decoded.userId).select('+refreshTokenHash');
      if (!user) {
      throw { statusCode: 404, message: "No encontramos una cuenta con ese correo electrónico. Verifica e intenta de nuevo." };
      }

      if (user.refreshTokenHash) {
        const isValid = await verifyTokenHash(refreshToken, user.refreshTokenHash);
        if (!isValid) {
          user.refreshTokenHash = undefined;
          await user.save();
          throw { statusCode: 401, message: "Token reutilizado detectado — sesión invalidada" };
        }
      }

      const userData = {
        _id: user._id,
        email: user.email,
        username: user.username,
        company: user.company || null,
        role: user.role,
      };
      const newToken = signSession(userData);
      const newRefreshToken = signRefreshToken(userData);
      user.refreshTokenHash = await hashToken(newRefreshToken);
      await user.save();

      return { token: newToken, refreshToken: newRefreshToken };
    } catch (err: any) {
      if (err.statusCode) throw err;
      throw { statusCode: 401, message: "Refresh token inválido o expirado" };
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    if (!currentPassword || !newPassword) {
      throw { statusCode: 400, message: "Contraseña actual y nueva son requeridas" };
    }
    if (newPassword.length < 6) {
      throw { statusCode: 400, message: "La nueva contraseña debe tener al menos 6 caracteres" };
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw { statusCode: 404, message: "Usuario no encontrado" };
    }

    const isValid = await checkingPassword(currentPassword, user.password);
    if (!isValid) {
      throw { statusCode: 401, message: "La contraseña actual no es correcta" };
    }

    user.password = newPassword;
    await user.save();

    auditLogService.log({ action: 'auth.password_changed', entityType: 'User', entityId: userId, userId });

    return { message: "Contraseña actualizada exitosamente" };
  }

  async logout(userId: string) {
    if (!userId) {
      throw { statusCode: 400, message: "Usuario requerido" };
    }

    const user = await User.findById(userId).select('+refreshTokenHash');
    if (user) {
      user.refreshTokenHash = undefined;
      await user.save();
      auditLogService.log({ action: 'auth.logout', entityType: 'User', entityId: userId, userId });
    }

    return { message: "Sesión cerrada exitosamente" };
  }

}

const authService = new AuthService();
export default authService;
