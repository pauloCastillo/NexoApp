import express from 'express';
import { 
  registerEmployeesTimeLocation,
  getTimeLocationEmployee,
 } from '@/controllers/locationController.js';

import { verifiedToken } from '@/middlewares/verifyToken.js';
import { Server } from 'socket.io';
import logger from '@/utils/logger.js';
import { randomUUID } from 'node:crypto';

const router = express.Router();

router.get("/:id", verifiedToken, getTimeLocationEmployee);
router.post("/", verifiedToken, registerEmployeesTimeLocation);

function setupEmployeeLocationNamespace(io: Server) {
  const employeeNamespace = io.of('/api/locations');

  employeeNamespace.use((socket, next) => {
    const uuid = (socket.handshake.auth?.requestId as string) || randomUUID();
    (socket.data as any).requestId = uuid;
    next();
  });

  employeeNamespace.on('connection', async (socket) => {
    const requestId = (socket.data as any).requestId as string;
    const log = logger.child({ requestId, socketId: socket.id });
    log.info('Location socket connected');
    socket.on("getLocation", async (data) => {
      try {
        log.info({ data }, "getLocation");
        // ponytail: same error contract as employees namespace — normalize if handler throws
        socket.emit("location", { data, requestId });
      } catch (err: unknown) {
        const { normalizeError } = await import('@/utils/normalizeError.js');
        const { catalogEntry } = await import('@/utils/errorCatalog.js');
        const appErr = normalizeError(err, requestId);
        const entry = catalogEntry(appErr.code);
        log.error({ err, code: appErr.code, requestId }, 'location socket error');
        socket.emit('error', { message: appErr.message || entry.message, code: appErr.code, requestId });
      }
    });
  });

  return employeeNamespace;
}

export { router, setupEmployeeLocationNamespace };
