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
      message: "SERVER ERROR! Trata registrándote de nuevo. " + error.message,
    });
  }
}

async function updateEmployee(req, res) {
  const { body } = req;
  console.log(body);
}

async function deleteEmployee(req, res) {
  const { id } = req.body;
  console.log(id);
}

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
