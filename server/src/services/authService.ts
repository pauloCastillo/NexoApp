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

    const newCompany = await Company.create({ name: ownerCompanyName.trim() });
    const owner = await User.create({ username: ownerName, email: ownerEmail, password: ownerPassword, phone: ownerPhone, role: 'business_owner', company: newCompany._id });
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
    const { email, password, confirmPassword, username, companyName, phone, jobTitle, role } = body;

    if (confirmPassword !== password) {
      throw { statusCode: 400, message: "Las contraseñas no coinciden" };
    }

    const existing = await User.findOne({ email });
    if (existing) {
      throw { statusCode: 409, message: "Ya existe un usuario registrado con esos datos, inicie sesión si es usted" };
    }

    const normalizedName = companyName?.trim();
    if (!normalizedName) {
      throw { statusCode: 400, message: "Nombre de empresa requerido" };
    }

    let company = await Company.findOne({ name: new RegExp(`^${normalizedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
    if (!company) {
      company = await Company.create({ name: normalizedName });
    }

    const user = await User.create({ username, email, password, phone, role: role || 'employee', company: company._id, jobTitle });
    const userData = { _id: user._id, email: user.email, username: user.username, company: company._id, role: user.role };
    const token = signSession(userData);
    const refreshToken = signRefreshToken(userData);
    user.refreshTokenHash = await hashToken(refreshToken);
    await user.save();

    auditLogService.log({ action: 'auth.register', entityType: 'User', entityId: user._id.toString(), companyId: company._id.toString() });

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
