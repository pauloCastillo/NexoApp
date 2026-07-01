import express from 'express';
import { 
  registerEmployeesTimeLocation,
  getTimeLocationEmployee,
 } from '@/controllers/locationController.js';

import { verifiedToken } from '@/middlewares/verifyToken.js';
import { Server } from 'socket.io';

const router = express.Router();

router.get("/:id", verifiedToken, getTimeLocationEmployee);
router.post("/", verifiedToken, registerEmployeesTimeLocation);

function setupEmployeeLocationNamespace(io: Server) {
  const employeeNamespace = io.of('/api/locations');
  
  employeeNamespace.on('connection', async (socket) => {
    console.log(socket.id);
    socket.on("getLocation", async (data) => {
      console.log("getLocation", data);
      // const employeeService = ServiceFactory.getService("location");
      // const locations = await employeeService.getLocation();
      // employeeNamespace.emit("getAllLocations", JSON.stringify({ locations }));
    });
 

  });
  
  return employeeNamespace;
}

export { router, setupEmployeeLocationNamespace };
