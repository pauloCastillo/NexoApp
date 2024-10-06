const { ControlTime } = require("../models");
class ControlTimeService {
  #timingRegister = {};

  constructor(data, idLocation, employeeId) {
    this.data = data;
    this.idLocation = idLocation;
    this.employeeId = employeeId;
  }

  async #registerTiming(existRegister, existEmployee) {
    if (existRegister) {
      switch (existEmployee.label) {
        case "entrada":
          this.#timingRegister = await ControlTime.findOneAndUpdate({
            employee: existEmployee.employee,
            entrada: existEmployee.time,
            locations: this.locationId,
          });
          break;
        case "descanso":
          this.#timingRegister = await ControlTime.findOneAndUpdate({
            employee: existEmployee.employee,
            descanso: existEmployee.time,
            locations: this.locationId,
          });
          break;
        case "retorno":
          this.#timingRegister = await ControlTime.findOneAndUpdate({
            employee: existEmployee.employee,
            retorno: existEmployee.time,
            locations: this.locationId,
          });
          break;
        case "salida":
          this.#timingRegister = await ControlTime.findOneAndUpdate({
            employee: existEmployee.employee,
            salida: existEmployee.time,
            locations: this.locationId,
          });
          break;
      }
    } else {
      switch (existEmployee.label) {
        case "entrada":
          this.#timingRegister = await ControlTime.create({
            employee: existEmployee.employee,
            entrada: existEmployee.time,
            locations: this.locationId,
          });
          break;
        case "descanso":
          this.#timingRegister = await ControlTime.create({
            employee: existEmployee.employee,
            descanso: existEmployee.time,
            locations: this.locationId,
          });
          break;
        case "retorno":
          this.#timingRegister = await ControlTime.create({
            employee: existEmployee.employee,
            retorno: existEmployee.time,
            locations: this.locationId,
          });
          break;
        case "salida":
          this.#timingRegister = await ControlTime.create({
            employee: existEmployee.employee,
            salida: existEmployee.time,
            locations: this.locationId,
          });
          break;
      }
    }
    return this.#timingRegister;
  }

  async timeRegister() {
    const getEmployees = await ControlTime.schema.methods.getEmployees();
    if (getEmployees.length === 0) {
      return "No existen empleados registrados en la base de datos";
    }
    const existEmployee = await ControlTime.findOne().where({
      employee: this.employeeId,
    });
    return await this.#registerTiming(existEmployee, this.data);
  }
}

module.exports = {
  ControlTimeService,
};
