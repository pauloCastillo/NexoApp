const { httpStatusCode } = require("../utils/httpStatus");
const ServiceFactory = require("../factories/serviceFactory");

async function registerEmployee(req, res) {
  const { user } = req.body;
  const userType = req.headers["user-agent"];

  try {
    if(userType === "mobile"){
      const newEmployee = ServiceFactory.getService("employee", user); 
      return res.status(httpStatusCode.CREATED).json({message:"registro exitoso!", newEmployee:await newEmployee.create() });
    }else if(userType === "desktop"){
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
    const { employee } = req.body;
    const existEmployee = new User(employee);
    const response = await existEmployee.loginChecking();
    response
      ? res.status(httpStatusCode.OK).json({ message: "bienvenido(a) " + response.username })
      : res
          .status(httpStatusCode.BAD_REQUEST)
          .json({ message: "Usuario o Contraseña incorrectos" });
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
