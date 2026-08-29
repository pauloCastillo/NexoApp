import { Request, Response } from 'express';
import { Location } from '@/db/models/index.js';
import ServiceFactory from '@/factories/serviceFactory.js';
import { httpStatusCode } from '@/utils/httpStatus.js';
import { ILocationTimeData } from '@/types/models.js';
import auditLogService from '@/services/auditLogService.js';
import { getIO } from '@/utils/socketManager.js';
import logger from '@/utils/logger.js';

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

async function registerEmployeesTimeLocation(req: Request<object, object, { locationTimeData: ILocationTimeData }>, res: Response) {
  const { locationTimeData } = req.body;
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const context = { companyId, role: userRole };
  const timeData = {
    employee:locationTimeData.employee,
    date: locationTimeData.date || new Date().toISOString(),
    label: locationTimeData.label,  
    time: new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit', hour12: false }),
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
  let newLocation;
  try {
    newLocation = await locationService.create();
  } catch (error: any) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    throw error;
  }

  timeData.location = newLocation._id.toString();
  const timerService = ServiceFactory.getService("timeControl", timeData, context);
  const newTime = await timerService.registerTime();

  auditLogService.log({ action: 'timeControl.checkin', entityType: 'TimeControl', entityId: newTime?._id?.toString(), userId: req.userId, companyId, metadata: { employee: timeData.employee, label: timeData.label }, ipAddress: req.ip });

  try {
    getIO().of('/api/dashboard').emit('attendanceUpdate', {
      employee: timeData.employee,
      label: timeData.label,
      time: timeData.time,
    });
  } catch (e) {
    logger.warn({ err: e }, 'Failed to emit attendanceUpdate');
  }

  res.status(httpStatusCode.OK).json({
    message: "Registro Exitoso",
    newTime,
  });
}

export { getTimeLocationEmployee, registerEmployeesTimeLocation,  };
