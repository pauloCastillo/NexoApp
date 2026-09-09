import type { TenantContext } from '@/types/models.js';
import type { ServiceMap, ServiceType } from '@/types/services.js';
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

export type { ServiceType } from '@/types/services.js';

type ServiceFactoryFn<T extends ServiceType> = (data: Record<string, unknown> | null, context?: TenantContext) => ServiceMap[T];

const registry: { [K in ServiceType]: ServiceFactoryFn<K> } = {
  employee: (_data, context) => new EmployeeService(context),
  manager: (_data, context) => new ManagerService(context),
  timeControl: (data, context) => new TimeControlService(data as Record<string, unknown>, new TimeControlRepository(), context),
  location: (data, context) => new LocationService(data as Record<string, unknown>, new LocationRepository(), context),
  client: (data, context) => new ClientService(data as Record<string, unknown>, new ClientRepository(), context),
  permission: (data, context) => new PermissionService(data as Record<string, unknown>, new PermissionRepository(), context),
  vacation: (data, context) => new VacationService(data as Record<string, unknown>, new VacationRepository(), context),
  workOrder: (data, context) => new WorkOrderService(data as Record<string, unknown>, new WorkOrderRepository(), context),
};

 
class ServiceFactory {
  static getService<T extends ServiceType>(serviceType: T, data: Record<string, unknown> | null = null, context?: TenantContext): ServiceMap[T] {
    const factory = registry[serviceType];
    if (!factory) throw new Error(`Service type ${serviceType as string} not recognized.`);
    return createErrorProxy(factory(data, context));
  }
}

export default ServiceFactory;