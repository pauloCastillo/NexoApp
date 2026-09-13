import express from 'express';
import { 
  registerEmployeesTimeLocation,
  getTimeLocationEmployee,
 } from '@/controllers/locationController.js';

import { verifiedToken } from '@/middlewares/verifyToken.js';
import { verifyingSession } from '@/utils/utils.js';
import { validate } from '@/middlewares/validate.js';
import { z } from 'zod';
import { Server } from 'socket.io';
import logger from '@/utils/logger.js';
import { randomUUID } from 'node:crypto';

const locationTimeSchema = z.object({
  locationTimeData: z.object({
    employee: z.string().min(1),
    location: z.object({ latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180) }),
    label: z.enum(['entrada', 'descanso', 'retorno', 'salida', 'checkInStart', 'breakStart', 'breakEnd', 'checkOut']),
    date: z.string().optional(),
    override: z.boolean().optional(),
    overrideReason: z.string().min(10).optional(),
  }),
});

const router = express.Router();

router.get("/:id", verifiedToken, getTimeLocationEmployee);
router.post("/", verifiedToken, validate(locationTimeSchema), registerEmployeesTimeLocation);

function setupEmployeeLocationNamespace(io: Server) {
  const employeeNamespace = io.of('/api/locations');

  // ponytail: socket auth — reject unauthenticated listeners (see auditoria #11)
  employeeNamespace.use((socket, next) => {
    const uuid = (socket.handshake.auth?.requestId as string) || randomUUID();
    (socket.data).requestId = uuid;
    const token = (socket.handshake.auth as any)?.token || (socket.handshake.headers as any)?.authorization?.replace('Bearer ', '');
    if (!token) return next(new Error('UNAUTHORIZED'));
    try {
      (socket.data).user = verifyingSession(token);
      next();
    } catch {
      next(new Error('UNAUTHORIZED'));
    }
  });

  employeeNamespace.on('connection', async (socket) => {
    const requestId = (socket.data).requestId as string;
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
