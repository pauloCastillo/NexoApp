import { Request, Response } from 'express';
import { httpStatusCode } from '@/utils/httpStatus.js';
import { checkingPassword, signSession } from '@/utils/utils.js';
import { Employee, ManagerModel, Company } from '@/db/models/index.js';
import ServiceFactory from '@/factories/serviceFactory.js';

async function registerEmployee(req: Request, res: Response) {
  const user = req.body;
  const userType = (req.headers["user-agent"] as string) || "";

  if (!user.inviteCode) {
    return res.status(httpStatusCode.BAD_REQUEST).json({
      message: "Código de invitación requerido",
    });
  }

  const company = await Company.findOne({ inviteCode: user.inviteCode.toUpperCase(), isActive: true });
  if (!company) {
    return res.status(httpStatusCode.NOT_FOUND).json({
      message: "Código de invitación inválido",
    });
  }

  user.company = company._id.toString();

  if (userType.includes("mobile")) {
    const newEmployee = ServiceFactory.getService("employee", user);
    return res.status(httpStatusCode.CREATED).json({
      message: "registro exitoso!",
      newEmployee: await newEmployee.create(),
    });
  } else if (userType.includes("desktop")) {
    const newManager = ServiceFactory.getService("manager", user);
    return res.status(httpStatusCode.CREATED).json({
      message: "registro exitoso!",
      newManager: await newManager.create(),
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
      return res.status(httpStatusCode.NOT_FOUND).json({ message: "Usuario no encontrado" });
    }

    const isValid = await checkingPassword(password, employee.password);
    if (!isValid) {
      return res.status(httpStatusCode.UNAUTHORIZE).json({ message: "Contraseña incorrecta" });
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

    return res.status(httpStatusCode.OK).json({
      message: "bienvenido(a) " + employee.username,
      employee: {
        id: employee._id,
        username: employee.username,
        email: employee.email,
        role: employee.role || "employee",
        token,
      },
    });
  } else if (userType.includes("desktop")) {
    const manager = await ManagerModel.findOne({ email }).select("+password");
    if (!manager) {
      return res.status(httpStatusCode.NOT_FOUND).json({ message: "Usuario no encontrado" });
    }

    const isValid = await checkingPassword(password, manager.password);
    if (!isValid) {
      return res.status(httpStatusCode.UNAUTHORIZE).json({ message: "Contraseña incorrecta" });
    }

    const userData = {
      _id: manager._id,
      email: manager.email,
      username: manager.username,
      company: manager.company || null,
      role: manager.role || "admin",
      userType: "manager",
    };
    const token = signSession(userData);

    return res.status(httpStatusCode.OK).json({
      message: "bienvenido(a) " + manager.username,
      manager: {
        id: manager._id,
        username: manager.username,
        email: manager.email,
        role: manager.role || "admin",
        token,
      },
    });
  }
}

export { registerEmployee, loginEmployee };
