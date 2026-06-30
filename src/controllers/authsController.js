import {  httpStatusCode  } from '../utils/httpStatus.js';
import {  checkingPassword, signSession  } from '../utils/utils.js';
import {  Employee, ManagerModel  } from '../db/models/index.js';
import ServiceFactory from '../factories/serviceFactory.js';

async function registerEmployee(req, res) {
  const user = req.body;
  const userType = req.headers["user-agent"];

  try {
    if (userType === "mobile" || userType.includes("mobile")) {
      const newEmployee = ServiceFactory.getService("employee", user);
      return res.status(httpStatusCode.CREATED).json({
        message: "registro exitoso!",
        newEmployee: await newEmployee.create(),
      });
    } else if (userType === "desktop" || userType.includes("desktop")) {
      const newManager = ServiceFactory.getService("manager", user);
      return res.status(httpStatusCode.CREATED).json({
        message: "registro exitoso!",
        newManager: await newManager.create(),
      });
    }
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).json({
      message: "SERVER ERROR! " + error.message,
    });
  }
}

async function loginEmployee(req, res) {
  try {
    const { email, password } = req.body;
    const userType = req.headers["user-agent"];

    if (!email || !password) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        message: "Correo y contraseña son requeridos",
      });
    }

    if (userType.includes("mobile")) {
      const employee = await Employee.findOne({ email }).select("+password");
      if (!employee) {
        return res
          .status(httpStatusCode.NOT_FOUND)
          .json({ message: "Usuario no encontrado" });
      }

      const isValid = await checkingPassword(password, employee.password);
      if (!isValid) {
        return res
          .status(httpStatusCode.UNAUTHORIZE)
          .json({ message: "Contraseña incorrecta" });
      }

      const token = signSession({ email: employee.email, username: employee.username });
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
        return res
          .status(httpStatusCode.NOT_FOUND)
          .json({ message: "Usuario no encontrado" });
      }

      const isValid = await checkingPassword(password, manager.password);
      if (!isValid) {
        return res
          .status(httpStatusCode.UNAUTHORIZE)
          .json({ message: "Contraseña incorrecta" });
      }

      const token = signSession({ email: manager.email, username: manager.username });
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
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).json({
      message: "SERVER ERROR! " + error.message,
    });
  }
}

export { registerEmployee, loginEmployee,  };
