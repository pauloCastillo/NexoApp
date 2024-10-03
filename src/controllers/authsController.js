const { httpStatusCode } = require("../utils/httpStatus");
const { Employee } = require("../db/models");
const { User } = require("../db/services/userServices");

async function registerEmployee(req, res) {
  const { user } = req.body;

  try {
    const employee = new User(user);
    employee.createEmployee();
    res.status(httpStatusCode.CREATED).send("registro exitoso!");
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
      ? res.status(httpStatusCode.OK).json({ message: "bienvenido" })
      : res
          .status(httpStatusCode.BAD_REQUEST)
          .json({ message: "Algo ocurrio!" });
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
