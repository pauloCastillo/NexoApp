const { Employee} = require("../db/models");
const { httpStatusCode } = require("../utils/httpStatus");

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
    const {user}= req.body;
    if (user.password !== user.confirmPassword) {
      return res.status(httpStatusCode.CONFLICT).json({
        message:
          "ERROR! Revisa la confirmación de contraseña debe ser igual a la contraseña",
      });
    }
    delete user.confirmPassword;
    console.log(user);
    const newUser = await Employee.create(user);
    res
      .status(httpStatusCode.CREATED)
      .json({ message: "usuario registrado exitosamente!", user: newUser });
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).json({
      messasge: "SERVER ERROR! Trata registrándote de nuevo" + error.message,
    });
  }
}

module.exports = {
  getEmployee,
  createEmployee,
};
