const { Location, ControlTime } = require("../db/models");
const {
  RegisterUserAndTimeService,
} = require("../db/services/timeControlService");
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

async function registerTimeLocationEmployee(req, res) {
  try {
    const { locationTimeData } = req.body;
    const timeData = {
      label: locationTimeData.label,
      time: locationTimeData.workerTime,
    };
    const newLocation = await Location.create({
      latitude: locationTimeData.location.latitude,
      longitude: locationTimeData.location.longitude,
    });

    const timerService = new RegisterUserAndTimeService();
    const timer = await timerService.timeRegister(timeData, newLocation._id);
    res
      .status(httpStatusCode.OK)
      .json({ location: newLocation, newTime: timer });
  } catch (error) {
    console.log(error);
    res.status(httpStatusCode.INTERNAL_SERVER).json({ message: error.message });
  }
}

module.exports = {
  getTimeLocationEmployee,
  registerTimeLocationEmployee,
};
