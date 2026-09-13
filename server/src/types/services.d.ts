import type { TenantContext } from '@/types/models.js';
import EmployeeService from '@/services/employeeService.js';
import ManagerService from '@/services/managerService.js';
import TimeControlService from '@/services/timeControlService.js';
import LocationService from '@/services/locationService.js';
import ClientService from '@/services/clientService.js';
import PermissionService from '@/services/permissionService.js';
import VacationService from '@/services/vacationService.js';
import WorkOrderService from '@/services/workOrderService.js';

export interface ServiceMap {
  employee: EmployeeService;
  manager: ManagerService;
  timeControl: TimeControlService;
  location: LocationService;
  client: ClientService;
  permission: PermissionService;
  vacation: VacationService;
  workOrder: WorkOrderService;
}

export type ServiceType = keyof ServiceMap;
