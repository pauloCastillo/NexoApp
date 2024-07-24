const { Employee } = require("../db/models");
const { httpStatusCode } = require("../utils/httpStatus");
const {
  RegisterUserAndTimeService,
} = require("../db/services/timeControlService");

async function getEmployees(req, res) {
  try {
    const getUsers = await Employee.find({});
    res.status(httpStatusCode.OK).json({ users: getUsers });
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).json({
      messasge: error.message,
    });
  }
}

async function getEmployee(req, res) {
  try {
    const { id } = req.params;
    const getUser = await Employee.findById({ _id: id });
    res.status(httpStatusCode.OK).json({ user: getUser });
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).json({
      messasge: error.message,
    });
  }
}

async function createEmployee(req, res) {
  try {
    const { user } = req.body;
    if (user.password !== user.confirmPassword) {
      return res.status(httpStatusCode.CONFLICT).json({
        message:
          "ERROR! Revisa la confirmación de contraseña debe ser igual a la contraseña",
      });
    }

    const newRegister = new RegisterUserAndTimeService();
    const newEmployee = await newRegister.CreateEmployee(user);
    res
      .status(httpStatusCode.CREATED)
      .json({ message: "usuario registrado exitosamente!", user: newEmployee });
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).json({
      messasge: "SERVER ERROR! Trata registrándote de nuevo. " + error.message,
    });
  }
}

async function loginEmployee(req, res) {
  try{
    const { employee } = req.body;
    const existEmployee = await Employee.findOne({ mail: employee.mail });
    if (!existEmployee) {
      return res.status(httpStatusCode.NO_CONTENT).json({ message: "No existe colaborador" });
    }
    console.log(existEmployee);
    res.status(httpStatusCode.OK).json({ message: "bienvenido", worker: existEmployee });
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).json({
      message: "SERVER ERROR! " + error.message,
    });
  }
}

module.exports = {
  getEmployees,
  createEmployee,
  loginEmployee,
};
