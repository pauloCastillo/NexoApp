import type { TenantContext } from '@/types/models.js';
import EmployeeService from '@/services/employeeService.js';
import ManagerService from '@/services/managerService.js';
import TimeControlRepository from '@/repositories/timeControlRepository.js';
import TimeControlService from '@/services/timeControlService.js';
import LocationService from '@/services/locationService.js';
import LocationRepository from '@/repositories/locationRepository.js';
import ClientRepository from '@/repositories/clientRepository.js';
import ClientService from '@/services/clientService.js';
import PermissionRepository from '@/repositories/permissionRepository.js';
import PermissionService from '@/services/permissionService.js';
import VacationRepository from '@/repositories/vacationRepository.js';
import VacationService from '@/services/vacationService.js';
import WorkOrderRepository from '@/repositories/workOrderRepository.js';
import WorkOrderService from '@/services/workOrderService.js';
import { createErrorProxy } from '@/utils/createErrorProxy.js';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class ServiceFactory {
  static getService(serviceType: string, data: Record<string, any> | null = null, context?: TenantContext): any {
    const wrap = <T extends object>(svc: T) => createErrorProxy(svc);
    const wrapRepo = <T extends object>(repo: T) => createErrorProxy(repo);
    switch (serviceType) {
      case "employee":
        return wrap(new EmployeeService(context));
      case "manager":
        return wrap(new ManagerService(context));
      case "timeControl":
        return wrap(new TimeControlService(data as Record<string, any>, wrapRepo(new TimeControlRepository()), context));
      case "location":
        return wrap(new LocationService(data as Record<string, any>, wrapRepo(new LocationRepository()), context));
      case "client":
        return wrap(new ClientService(data as Record<string, any>, wrapRepo(new ClientRepository()), context));
      case "permission":
        return wrap(new PermissionService(data as Record<string, any>, wrapRepo(new PermissionRepository()), context));
      case "vacation":
        return wrap(new VacationService(data as Record<string, any>, wrapRepo(new VacationRepository()), context));
      case "workOrder":
        return wrap(new WorkOrderService(data as Record<string, any>, wrapRepo(new WorkOrderRepository()), context));
      default:
        throw new Error(`Service type ${serviceType} not recognized.`);
    }
  }
}

export default ServiceFactory;