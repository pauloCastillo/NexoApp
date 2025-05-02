const express = require("express");
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const ServiceFactory = require("../factories/serviceFactory");
const { verifiedToken } = require("../middlewares/verifyToken");

const router = express.Router();

router.route("/")
.get(verifiedToken, getAllEmployees)
.post(verifiedToken, createEmployee);

router.route("/:employee_id")
.get(verifiedToken, getEmployeeById)
.delete(verifiedToken, deleteEmployee);

function setupEmployeeNamespace(io) {
  const employeeNamespace = io.of('/api/employees');
  
  employeeNamespace.on('connection', async (socket) => {
    
    console.log(socket.id);
    const employeeService = ServiceFactory.getService("employee");
      const employees = await employeeService.getAll();
      employeeNamespace.emit("getAllEmployees", JSON.stringify({ users: employees }));

  });
  
  return employeeNamespace;
}

module.exports = {router, setupEmployeeNamespace};
