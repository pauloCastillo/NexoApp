const { Location } = require("../db/models");
const ServiceFactory = require("../factories/serviceFactory");
const { httpStatusCode } = require("../utils/httpStatus");

async function getTimeLocationEmployee(req, res) {
  try {
    const { id } = req.params;
    const allLocationsEmployee = await Location.find({ employee: id });
    res
      .status(httpStatusCode.OK)
      .json({ employeeLocations: allLocationsEmployee });
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).json({ message: error.message });
  }
}

async function registerEmployeesTimeLocation(req, res) {
  try {
    const { locationTimeData } = req.body;

    const timeData = {
      employee:locationTimeData.employee,
      date: locationTimeData.date,
      label: locationTimeData.label,  
      time: locationTimeData.time,
      location:"",
    };

    const locationData = {
      latitude: locationTimeData.location.latitude,
      longitude: locationTimeData.location.longitude,
      street: "",
      employee: locationTimeData.employee
    } 

    const locationService = ServiceFactory.getService("location",  locationData);
    const newLocation = await locationService.create();

    timeData.location = newLocation._id.toString();
    const timerService = ServiceFactory.getService("timeControl", timeData);
    
    res.status(httpStatusCode.OK).json({
      message: "Registro Exitoso",
      newTime: await timerService.registerTime(),
    });
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).json({ message: error.message });
  }
}

module.exports = {
  getTimeLocationEmployee,
  registerEmployeesTimeLocation,
};
