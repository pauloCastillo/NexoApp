import { Request, Response } from 'express';
import { Location } from '@/db/models/index.js';
import ServiceFactory from '@/factories/serviceFactory.js';
import { httpStatusCode } from '@/utils/httpStatus.js';
import { DateTime } from 'luxon';
import { ILocationTimeData } from '@/types/models.js';

async function getTimeLocationEmployee(req: Request, res: Response) {
  const { id } = req.params;
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const filter: Record<string, any> = { employee: id };
  if (userRole !== 'superuser' && companyId) {
    filter.company = companyId;
  }
  const allLocationsEmployee = await Location.find(filter);
  res
    .status(httpStatusCode.OK)
    .json({ employeeLocations: allLocationsEmployee });
}

async function registerEmployeesTimeLocation(req: Request<{}, {}, { locationTimeData: ILocationTimeData }>, res: Response) {
  const { locationTimeData } = req.body;
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const userType = (req as any).userType;
  const context = { companyId, role: userRole, userType };
  const timeData = {
    employee:locationTimeData.employee,
    date: locationTimeData.date || DateTime.now().setZone("America/La_Paz").toISO(),
    label: locationTimeData.label,  
    time: locationTimeData.time,
    location:"",
    company: companyId,
  };

  const locationData = {
    latitude: locationTimeData.location.latitude,
    longitude: locationTimeData.location.longitude,
    employee: locationTimeData.employee,
    company: companyId,
  } 

  const locationService = ServiceFactory.getService("location",  locationData, context);
  const newLocation = await locationService.create();

  timeData.location = newLocation._id.toString();
  const timerService = ServiceFactory.getService("timeControl", timeData, context);
  
  res.status(httpStatusCode.OK).json({
    message: "Registro Exitoso",
    newTime: await timerService.registerTime(),
  });
}

export { getTimeLocationEmployee, registerEmployeesTimeLocation,  };
