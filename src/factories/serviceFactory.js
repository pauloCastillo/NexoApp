const EmployeeRepository = require("../repositories/employeeRepository");
const EmployeeService = require("../services/employeeService");
const ManagerRepository = require("../repositories/managerRepository");
const ManagerService = require("../services/managerService");
const TimeControlRepository = require("../repositories/timeControlRepository");
const TimeControlService = require("../services/timeControlService");
const LocationService = require("../services/locationService");
const LocationRepository = require("../repositories/locationRepository");

class ServiceFactory {
  static getService(serviceType, data) {
    switch (serviceType) {
      case "employee":
        return new EmployeeService(data, new EmployeeRepository());
      case "manager":
        return new ManagerService(data, new ManagerRepository());
      case "timeControl":
        return new TimeControlService(data, new TimeControlRepository());
      case "location":
        return new LocationService(data, new LocationRepository());
      default:
        throw new Error(`Service type ${serviceType} not recognized.`);
    }
  }
}

module.exports = ServiceFactory;