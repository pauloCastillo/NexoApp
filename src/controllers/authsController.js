const { httpStatusCode } = require("../utils/httpStatus");
const { User } = require("../db/services/userServices");

async function registerEmployee(req, res) {
  const { user } = req.body;
  try {
    const employee = new User(user);
    res.status(httpStatusCode.CREATED).json({message:"registro exitoso!", newEmployee: await employee.createEmployee()});
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
