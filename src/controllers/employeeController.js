const { Employee } = require("../db/models");
const { httpStatusCode } = require("../utils/httpStatus");
const ServiceFactory = require("../factories/serviceFactory");


async function getAllEmployees(req, res) {
  try {
    const employeeService = ServiceFactory.getService("employee", Employee);
    const getUsers = await employeeService.getAll();
    res.status(httpStatusCode.OK).json({ users: getUsers });  
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).json({
      messasge: error.message,
    });
  }
}

async function getEmployeeById(req, res) {
  const { id } = req.params;
  try {
    const employeeService = ServiceFactory.getService("employee", Employee);
    const employee = await employeeService.getEmployee(id);
    res.status(httpStatusCode.OK).json({ user: employee });
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).json({
      message: error.message,
    });
  }
}

async function deleteEmployee(req, res) {
  const { id } = req.params;
  const employeeService = ServiceFactory.getService("employee", Employee);
  const deletedEmployee = await employeeService.delete(id);
  if (!deletedEmployee) {
    return res.status(httpStatusCode.NOT_FOUND).json({
      message: "Employee not found",
    });
  } else {
    return res.status(httpStatusCode.OK).json({
      message: "Employee deleted successfully",
    });
  }
}

module.exports = {
  getAllEmployees,
  getEmployeeById,
  deleteEmployee
};
