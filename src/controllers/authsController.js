const { httpStatusCode } = require("../utils/httpStatus");
const ServiceFactory = require("../factories/serviceFactory");

async function registerEmployee(req, res) {
  const user = req.body;
  const userType = req.headers["user-agent"];

  try {
    if(userType === "mobile" || userType.includes("mobile")){
      const newEmployee = ServiceFactory.getService("employee", user); 
      return res.status(httpStatusCode.CREATED).json({message:"registro exitoso!", newEmployee:await newEmployee.create() });
    }else if(userType === "desktop" || userType.includes("desktop")){
      const newManager = ServiceFactory.getService("manager", user);
      return res.status(httpStatusCode.CREATED).json({message:"registro exitoso!", newManager: await newManager.create() });
    }
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).json({
      message: "SERVER ERROR! " + error.message,
    });
  }
}

async function loginEmployee(req, res) {
  try {
    const user = req.body;
    const userType = req.headers["user-agent"];
    
    if(userType.includes("mobile")){
      const employeeService = ServiceFactory.getService("employee", user);
      const existEmployee = await employeeService.getEmployee();
      return res.status(httpStatusCode.OK).json({ message: "bienvenido(a) " + existEmployee.username });
    }else if(userType.includes("desktop")){
      const managerService = ServiceFactory.getService("manager", user)
      const existManager = await managerService.getManager();
      // DEVOLVER UN TOKEN DE EXITO con caducidad
      return res.status(httpStatusCode.OK).json({ message: "bienvenido(a) " + existManager.username });
    }
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).json({
      message: "SERVER ERROR! " + error.message,
    });
  }
}

module.exports = {
  registerEmployee,
  loginEmployee,
};
