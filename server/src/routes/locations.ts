import express from 'express';
import { 
  registerEmployeesTimeLocation,
  getTimeLocationEmployee,
 } from '@/controllers/locationController.js';

import { verifiedToken } from '@/middlewares/verifyToken.js';
import { Server } from 'socket.io';
import logger from '@/utils/logger.js';

const router = express.Router();

router.get("/:id", verifiedToken, getTimeLocationEmployee);
router.post("/", verifiedToken, registerEmployeesTimeLocation);

function setupEmployeeLocationNamespace(io: Server) {
  const employeeNamespace = io.of('/api/locations');
  
  employeeNamespace.on('connection', async (socket) => {
    logger.info({ socketId: socket.id }, 'Location socket connected');
    socket.on("getLocation", async (data) => {
      logger.info({ data }, "getLocation");
      console.log("getLocation", data);
    }); 

  });
  
  return employeeNamespace;
}

export { router, setupEmployeeLocationNamespace };
