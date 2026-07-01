import express from 'express';
import { 
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  deleteEmployee,
 } from '@/controllers/employeeController.js';
import ServiceFactory from '@/factories/serviceFactory.js';
import { verifiedToken } from '@/middlewares/verifyToken.js';
import { Server } from 'socket.io';

const router = express.Router();

router.route("/")
.get(verifiedToken, getAllEmployees)
.post(verifiedToken, createEmployee);

router.route("/:employee_id")
.get(verifiedToken, getEmployeeById)
.delete(verifiedToken, deleteEmployee);

import { verifyingSession } from '@/utils/utils.js';

function setupEmployeeNamespace(io: Server) {
  const employeeNamespace = io.of('/api/employees');
  
  employeeNamespace.on('connection', async (socket) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
    if (!token) {
      socket.emit('error', { message: 'token required' });
      return;
    }
    const decoded = verifyingSession(token);
    if (decoded.error) {
      socket.emit('error', { message: decoded.error });
      return;
    }
    const context = { companyId: decoded.companyId, role: decoded.role, userType: decoded.userType };
    const employeeService = ServiceFactory.getService("employee", null, context);
    const employees = await employeeService.getAll();
    employeeNamespace.emit("getAllEmployees", JSON.stringify({ users: employees }));
  });
  
  return employeeNamespace;
}

export { router, setupEmployeeNamespace };
