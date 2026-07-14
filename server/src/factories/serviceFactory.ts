import type { TenantContext } from '@/types/models.js';
import EmployeeRepository from '@/repositories/employeeRepository.js';
import EmployeeService from '@/services/employeeService.js';
import ManagerRepository from '@/repositories/managerRepository.js';
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

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class ServiceFactory {
  static getService(serviceType: string, data: Record<string, any> | null = null, context?: TenantContext): any {
    switch (serviceType) {
      case "employee":
        return new EmployeeService(data as Record<string, any>, new EmployeeRepository(), context);
      case "manager":
        return new ManagerService(data as Record<string, any>, new ManagerRepository(), context);
      case "timeControl":
        return new TimeControlService(data as Record<string, any>, new TimeControlRepository(), context);
      case "location":
        return new LocationService(data as Record<string, any>, new LocationRepository(), context);
      case "client":
        return new ClientService(data as Record<string, any>, new ClientRepository(), context);
      case "permission":
        return new PermissionService(data as Record<string, any>, new PermissionRepository(), context);
      case "vacation":
        return new VacationService(data as Record<string, any>, new VacationRepository(), context);
      case "workOrder":
        return new WorkOrderService(data as Record<string, any>, new WorkOrderRepository(), context);
      default:
        throw new Error(`Service type ${serviceType} not recognized.`);
    }
  }
}

export default ServiceFactory;