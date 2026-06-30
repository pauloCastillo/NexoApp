import EmployeeRepository from '../repositories/employeeRepository.js';
import EmployeeService from '../services/employeeService.js';
import ManagerRepository from '../repositories/managerRepository.js';
import ManagerService from '../services/managerService.js';
import TimeControlRepository from '../repositories/timeControlRepository.js';
import TimeControlService from '../services/timeControlService.js';
import LocationService from '../services/locationService.js';
import LocationRepository from '../repositories/locationRepository.js';
import ClientRepository from '../repositories/clientRepository.js';
import ClientService from '../services/clientService.js';
import PermissionRepository from '../repositories/permissionRepository.js';
import PermissionService from '../services/permissionService.js';
import VacationRepository from '../repositories/vacationRepository.js';
import VacationService from '../services/vacationService.js';
import WorkOrderRepository from '../repositories/workOrderRepository.js';
import WorkOrderService from '../services/workOrderService.js';

class ServiceFactory {
  static getService(serviceType, data = null) {
    switch (serviceType) {
      case "employee":
        return new EmployeeService(data, new EmployeeRepository());
      case "manager":
        return new ManagerService(data, new ManagerRepository());
      case "timeControl":
        return new TimeControlService(data, new TimeControlRepository());
      case "location":
        return new LocationService(data, new LocationRepository());
      case "client":
        return new ClientService(data, new ClientRepository());
      case "permission":
        return new PermissionService(data, new PermissionRepository());
      case "vacation":
        return new VacationService(data, new VacationRepository());
      case "workOrder":
        return new WorkOrderService(data, new WorkOrderRepository());
      default:
        throw new Error(`Service type ${serviceType} not recognized.`);
    }
  }
}

export default ServiceFactory;