require("dotenv").config();
const axios = require("axios");
const { Location } = require("../db/models");
const ServiceFactory = require("../factories/serviceFactory");
const { httpStatusCode } = require("../utils/httpStatus");
const { Report } = require("../services/reportService");

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

    const response = await axios.get(
      `https://discover.search.hereapi.com/v1/discover?at=${locationTimeData.location.latitude},${locationTimeData.location.longitude}&q=${locationTimeData.location.latitude},${locationTimeData.location.longitude}&in=countryCode%3ABOL&apiKey=${process.env.API_KEY}`
    );

    const streetName = response.data.items[0].title;
    const newLocation = await Location.create({
      latitude: locationTimeData.location.latitude,
      longitude: locationTimeData.location.longitude,
      street: streetName,
    });

    timeData.location = newLocation._id.toString();
    const timerService = ServiceFactory.getService("timeControl", timeData);
    
    // const reportHandler = new Report();
    // await reportHandler.createReport();
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
