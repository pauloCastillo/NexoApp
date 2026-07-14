import { Request, Response } from 'express';
import { httpStatusCode } from '@/utils/httpStatus.js';
import { checkingPassword, signSession, signRefreshToken, hashToken, verifyTokenHash } from '@/utils/utils.js';
import { Employee, ManagerModel, Company } from '@/db/models/index.js';
import ServiceFactory from '@/factories/serviceFactory.js';
import auditLogService from '@/services/auditLogService.js';
import jwt from 'jsonwebtoken';

async function registerEmployee(req: Request, res: Response) {
  const user = req.body;
  const userType = (req.headers["user-agent"] as string) || "";

  let company: any;

  if (user.inviteCode) {
    company = await Company.findOne({ inviteCode: user.inviteCode.toUpperCase(), isActive: true });
    if (!company) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        message: "Código de invitación inválido",
      });
    }
  } else if (user.companyName) {
    const normalizedName = user.companyName.trim();
    if (!normalizedName) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        message: "Nombre de la empresa requerido",
      });
    }
    company = await Company.findOne({ name: { $regex: new RegExp(`^${normalizedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } });
    if (!company) {
      company = await Company.create({ name: normalizedName });
    }
  } else {
    return res.status(httpStatusCode.BAD_REQUEST).json({
      message: "Código de invitación o nombre de empresa requerido",
    });
  }

  user.company = company._id.toString();

  if (userType.includes("mobile")) {
    const context = { companyId: company._id.toString(), role: 'employee', userType: 'employee' };
    if (!user.inviteCode) {
      user.role = 'manager';
    }
    const newEmployee = ServiceFactory.getService("employee", user, context);
    return res.status(httpStatusCode.CREATED).json({
      message: "registro exitoso!",
      newEmployee: await newEmployee.create(),
      companyId: company._id.toString(),
      inviteCode: company.inviteCode,
    });
  } else if (userType.includes("desktop")) {
    const context = { companyId: company._id.toString(), role: user.role || 'editor', userType: 'manager' };
    const newManager = ServiceFactory.getService("manager", user, context);
    return res.status(httpStatusCode.CREATED).json({
      message: "registro exitoso!",
      newManager: await newManager.create(),
      companyId: company._id.toString(),
    });
  }
}

async function loginEmployee(req: Request, res: Response) {
  const { email, password } = req.body;
  const userType = (req.headers["user-agent"] as string) || "";

  if (!email || !password) {
    return res.status(httpStatusCode.BAD_REQUEST).json({
      message: "Correo y contraseña son requeridos",
    });
  }

  if (userType.includes("mobile")) {
    const employee = await Employee.findOne({ email }).select("+password");
    if (!employee) {
      await auditLogService.log({ action: 'auth.login_failed', entityType: 'User', metadata: { email, reason: 'not_found' }, ipAddress: req.ip });
      return res.status(httpStatusCode.NOT_FOUND).json({ message: "Usuario no encontrado" });
    }

    const isValid = await checkingPassword(password, employee.password);
    if (!isValid) {
      await auditLogService.log({ action: 'auth.login_failed', entityType: 'User', entityId: employee._id.toString(), metadata: { email, reason: 'wrong_password' }, ipAddress: req.ip });
      return res.status(httpStatusCode.UNAUTHORIZED).json({ message: "Contraseña incorrecta" });
    }

    const userData = {
      _id: employee._id,
      email: employee.email,
      username: employee.username,
      company: employee.company,
      role: employee.role || "employee",
      userType: "employee",
    };
    const token = signSession(userData);
    const refreshToken = signRefreshToken(userData);
    employee.refreshTokenHash = await hashToken(refreshToken);
    await employee.save();

    auditLogService.log({ action: 'auth.login', entityType: 'User', entityId: employee._id.toString(), userId: employee._id.toString(), companyId: employee.company?.toString(), ipAddress: req.ip });

    return res.status(httpStatusCode.OK).json({
      message: "bienvenido(a) " + employee.username,
      employee: {
        id: employee._id,
        username: employee.username,
        email: employee.email,
        role: employee.role || "employee",
        token,
        refreshToken,
      },
    });
  } else if (userType.includes("desktop")) {
    const manager = await ManagerModel.findOne({ email }).select("+password");
    if (!manager) {
      await auditLogService.log({ action: 'auth.login_failed', entityType: 'Manager', metadata: { email, reason: 'not_found' }, ipAddress: req.ip });
      return res.status(httpStatusCode.NOT_FOUND).json({ message: "Usuario no encontrado" });
    }

    const isValid = await checkingPassword(password, manager.password);
    if (!isValid) {
      await auditLogService.log({ action: 'auth.login_failed', entityType: 'Manager', entityId: manager._id.toString(), metadata: { email, reason: 'wrong_password' }, ipAddress: req.ip });
      return res.status(httpStatusCode.UNAUTHORIZED).json({ message: "Contraseña incorrecta" });
    }

    const userData = {
      _id: manager._id,
      email: manager.email,
      username: manager.username,
      company: manager.company || null,
      role: manager.role || "editor",
      userType: "manager",
    };
    const token = signSession(userData);
    const refreshToken = signRefreshToken(userData);
    manager.refreshTokenHash = await hashToken(refreshToken);
    await manager.save();

    auditLogService.log({ action: 'auth.login', entityType: 'Manager', entityId: manager._id.toString(), userId: manager._id.toString(), companyId: manager.company?.toString(), ipAddress: req.ip });

    return res.status(httpStatusCode.OK).json({
      message: "bienvenido(a) " + manager.username,
      manager: {
        id: manager._id,
        username: manager.username,
        email: manager.email,
        role: manager.role || "editor",
        token,
        refreshToken,
      },
    });
  }
}

async function refreshTokenEndpoint(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(httpStatusCode.BAD_REQUEST).json({ message: "Refresh token requerido" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY!) as Record<string, any>;
    if (decoded.type !== 'refresh') {
      return res.status(httpStatusCode.UNAUTHORIZED).json({ message: "Token inválido" });
    }

    const employeeId = decoded.employeeId;
    let userData: Record<string, any> | null = null;
    let userDoc: any = null;

    const employee = await Employee.findById(employeeId).select('+refreshTokenHash');
    if (employee) {
      userDoc = employee;
      userData = {
        _id: employee._id,
        email: employee.email,
        username: employee.username,
        company: employee.company,
        role: employee.role || "employee",
        userType: "employee",
      };
    }

    if (!userData) {
      const manager = await ManagerModel.findById(employeeId);
      if (manager) {
        userDoc = manager;
        userData = {
          _id: manager._id,
          email: manager.email,
          username: manager.username,
          company: manager.company || null,
          role: manager.role || "editor",
          userType: "manager",
        };
      }
    }

    if (!userData || !userDoc) {
      return res.status(httpStatusCode.NOT_FOUND).json({ message: "Usuario no encontrado" });
    }

    if (userDoc.refreshTokenHash) {
      const isValid = await verifyTokenHash(refreshToken, userDoc.refreshTokenHash);
      if (!isValid) {
        userDoc.refreshTokenHash = undefined;
        await userDoc.save();
        return res.status(httpStatusCode.UNAUTHORIZED).json({ message: "Token reutilizado detectado — sesión invalidada" });
      }
    }

    const newToken = signSession(userData);
    const newRefreshToken = signRefreshToken(userData);
    userDoc.refreshTokenHash = await hashToken(newRefreshToken);
    await userDoc.save();

    res.status(httpStatusCode.OK).json({
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch {
    res.status(httpStatusCode.UNAUTHORIZED).json({ message: "Refresh token inválido o expirado" });
  }
}

export { registerEmployee, loginEmployee, refreshTokenEndpoint };
