import { Request, Response } from 'express';
import { proxyController } from '@/utils/proxyController.js';
import { Location } from '@/db/models/index.js';
import ServiceFactory from '@/factories/serviceFactory.js';
import { httpStatusCode } from '@/utils/httpStatus.js';
import { ILocationTimeData } from '@/types/models.js';
import auditLogService from '@/services/auditLogService.js';
import { getIO } from '@/utils/socketManager.js';
import logger from '@/utils/logger.js';

async function _raw_getTimeLocationEmployee(req: Request, res: Response) {
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

async function _raw_registerEmployeesTimeLocation(req: Request<object, object, { locationTimeData: ILocationTimeData }>, res: Response) {
  const { locationTimeData } = req.body;
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const context: any = { companyId, role: userRole, userId: (req as any).userId };
  const timeData: any = {
    employee:locationTimeData.employee,
    date: locationTimeData.date || new Date().toISOString(),
    label: locationTimeData.label,  
    time: new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit', hour12: false }),
    location:"",
    company: companyId,
    geofenceResult: null,
  };

  const locationData: any = {
    latitude: locationTimeData.location.latitude,
    longitude: locationTimeData.location.longitude,
    employee: locationTimeData.employee,
    company: companyId,
    override: (locationTimeData as any).override,
    overrideReason: (locationTimeData as any).overrideReason,
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
  const injected = (newLocation as any)._injectedGeofenceResult;
  const lastLoc = injected ? { geofenceResult: injected } as any : (newLocation.locations as any[])?.[newLocation.locations.length - 1] as any;
  timeData.geofenceResult = lastLoc?.geofenceResult ?? injected ?? null;
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

  const warning = lastLoc?.geofenceResult && !lastLoc.geofenceResult.inside && !lastLoc.geofenceResult.overriddenBy
    ? `Fuera del área permitida (${lastLoc.geofenceResult.distance}m${lastLoc.geofenceResult.branchName ? `, sucursal ${lastLoc.geofenceResult.branchName}` : ''})`
    : null;
  res.status(httpStatusCode.OK).json({
    message: warning ? `Registro exitoso con advertencia: ${warning}` : "Registro Exitoso",
    warning: warning || undefined,
    geofenceResult: lastLoc?.geofenceResult,
    newTime,
  });
}

const _handlers = { getTimeLocationEmployee: _raw_getTimeLocationEmployee, registerEmployeesTimeLocation: _raw_registerEmployeesTimeLocation };
const _proxied: any = proxyController(_handlers as any);
export const getTimeLocationEmployee = _proxied.getTimeLocationEmployee;
export const registerEmployeesTimeLocation = _proxied.registerEmployeesTimeLocation;

