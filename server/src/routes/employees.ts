import express from 'express';
import { 
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
 } from '@/controllers/employeeController.js';
import { assignBranches } from '@/controllers/employeeBranchesController.js';
import ServiceFactory from '@/factories/serviceFactory.js';
import { verifiedToken } from '@/middlewares/verifyToken.js';
import { Server } from 'socket.io';

const router = express.Router();

router.route("/")
.get(verifiedToken, getAllEmployees)
.post(verifiedToken, createEmployee);

router.route("/:employee_id")
.get(verifiedToken, getEmployeeById)
.put(verifiedToken, updateEmployee)
.delete(verifiedToken, deleteEmployee);

router.put("/:employee_id/branches", verifiedToken, assignBranches);

import { verifyingSession } from '@/utils/utils.js';
import { normalizeError } from '@/utils/normalizeError.js';
import { catalogEntry } from '@/utils/errorCatalog.js';
import { randomUUID } from 'node:crypto';
import logger from '@/utils/logger.js';

function setupEmployeeNamespace(io: Server) {
  const employeeNamespace = io.of('/api/employees');

  // ponytail: socket auth — reject unauthenticated listeners (see auditoria #11)
  employeeNamespace.use((socket, next) => {
    (socket.data as any).requestId = (socket.handshake.auth?.requestId as string) || randomUUID();
    const token = socket.handshake.auth?.token || (socket.handshake.headers as any)?.authorization?.replace('Bearer ', '');
    if (!token) return next(new Error('UNAUTHORIZED'));
    try {
      const decoded: any = verifyingSession(token);
      (socket.data as any).user = decoded;
      next();
    } catch {
      next(new Error('UNAUTHORIZED'));
    }
  });

  employeeNamespace.on('connection', async (socket) => {
    const requestId = (socket.data as any).requestId as string;
    const log = logger.child({ requestId });
    try {
      const decoded: any = (socket.data as any).user;
      if (!decoded) {
        const e = catalogEntry('UNAUTHORIZED');
        socket.emit('error', { message: e.message, code: 'UNAUTHORIZED', requestId });
        return;
      }
      const context = { companyId: (decoded as any).companyId, role: (decoded as any).role };
      const employeeService = ServiceFactory.getService("employee", null, context);
      const employees = await employeeService.getAll();
      employeeNamespace.emit("getAllEmployees", JSON.stringify({ users: employees, requestId }));
    } catch (err: unknown) {
      const appErr = normalizeError(err, requestId);
      const entry = catalogEntry(appErr.code);
      log.error({ err, code: appErr.code, requestId }, 'socket error');
      socket.emit('error', { message: appErr.message || entry.message, code: appErr.code, requestId });
    }
  });

  return employeeNamespace;
}

export { router, setupEmployeeNamespace };
