const express = require("express");
const {
  registerEmployeesTimeLocation,
  getTimeLocationEmployee,
} = require("../controllers/locationController");

const { verifiedToken } = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/:id", getTimeLocationEmployee);
router.post("/", verifiedToken, registerEmployeesTimeLocation);

function setupEmployeeLocationNamespace(io) {
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

module.exports = {router, setupEmployeeLocationNamespace};
