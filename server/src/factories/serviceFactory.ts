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

export type ServiceType = "employee" | "manager" | "timeControl" | "location" | "client" | "permission" | "vacation" | "workOrder";

const registry: Record<ServiceType, (data: Record<string, any> | null, context?: TenantContext) => object> = {
  employee: (_data, context) => new EmployeeService(context),
  manager: (_data, context) => new ManagerService(context),
  timeControl: (data, context) => new TimeControlService(data as Record<string, any>, new TimeControlRepository(), context),
  location: (data, context) => new LocationService(data as Record<string, any>, new LocationRepository(), context),
  client: (data, context) => new ClientService(data as Record<string, any>, new ClientRepository(), context),
  permission: (data, context) => new PermissionService(data as Record<string, any>, new PermissionRepository(), context),
  vacation: (data, context) => new VacationService(data as Record<string, any>, new VacationRepository(), context),
  workOrder: (data, context) => new WorkOrderService(data as Record<string, any>, new WorkOrderRepository(), context),
};

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class ServiceFactory {
  static getService(serviceType: ServiceType, data: Record<string, any> | null = null, context?: TenantContext): any {
    const wrap = <T extends object>(svc: T) => createErrorProxy(svc);
    const factory = registry[serviceType];
    if (!factory) throw new Error(`Service type ${serviceType} not recognized.`);
    return wrap(factory(data, context) as object);
  }
}

export default ServiceFactory;