import express from 'express';
import { 
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  deleteEmployee,
 } from '../controllers/employeeController.js';
import ServiceFactory from '../factories/serviceFactory.js';
import {  verifiedToken  } from '../middlewares/verifyToken.js';

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

export { router, setupEmployeeNamespace };
