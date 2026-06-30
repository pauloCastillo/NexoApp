import {  Location  } from '../db/models/index.js';
import ServiceFactory from '../factories/serviceFactory.js';
import {  httpStatusCode  } from '../utils/httpStatus.js';
import {  DateTime  } from 'luxon';

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
      date: locationTimeData.date || DateTime.now().setZone("America/La_Paz").toISO(),
      label: locationTimeData.label,  
      time: locationTimeData.time,
      location:"",
    };

    const locationData = {
      latitude: locationTimeData.location.latitude,
      longitude: locationTimeData.location.longitude,
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

export { getTimeLocationEmployee, registerEmployeesTimeLocation,  };
