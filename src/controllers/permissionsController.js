import {  httpStatusCode  } from '../utils/httpStatus.js';
import ServiceFactory from '../factories/serviceFactory.js';

async function getPermissionsByEmployee(req, res) {
  try {
    const { employee_id } = req.params;
    const permissionService = ServiceFactory.getService("permission");
    const permissions = await permissionService.getByEmployee(employee_id);
    res.status(httpStatusCode.OK).json({ permissions });
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).json({
      message: error.message,
    });
  }
}

async function createPermission(req, res) {
  try {
    const permissionService = ServiceFactory.getService("permission", req.body);
    const permission = await permissionService.create();
    res.status(httpStatusCode.CREATED).json({
      message: "Permiso solicitado exitosamente",
      permission,
    });
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).json({
      message: error.message,
    });
  }
}

export { getPermissionsByEmployee, createPermission,  };
