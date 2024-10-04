require("dotenv").config();
const axios = require("axios");
const { Location } = require("../db/models");
const { ControlTimeService } = require("../db/services/timeControlService");
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
      label: locationTimeData.label,
      time: locationTimeData.workerTime,
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

    const timerService = new ControlTimeService(
      timeData,
      newLocation._id,
      locationTimeData.employee
    );

    const timer = await timerService.timeRegister();

    res.status(httpStatusCode.OK).json({
      message: "Registro Exitoso",
      location: newLocation,
      newTime: timer,
    });
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER).json({ message: error.message });
  }
}

module.exports = {
  getTimeLocationEmployee,
  registerEmployeesTimeLocation,
};
