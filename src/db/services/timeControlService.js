const { ControlTime } = require("../models");
class ControlTimeService {
  constructor(data, idLocation, employeeId) {
    this.data = data;
    this.idLocation = idLocation;
    this.employeeId = employeeId;
  }

  async timeRegister() {
    const employees = await ControlTime.schema.methods.getEmployees();
    const existEmployee = employees.find(
      (item) => item.employee.toString() === this.employeeId.toString()
    );
    let newWorkTime;
    if (!existEmployee && employees.length === 0) {
      return new Error("No existe trabajador en la base de datos");
    } else if (!existEmployee && employees.length !== 0) {
      return employees;
    } else {
      switch (this.data.label) {
        case "entrada":
          newWorkTime = await ControlTime.create({
            employee: existEmployee.employee,
            entrada: this.data.time,
            locations: this.locationId,
          });
          break;
        case "descanso":
          newWorkTime = await ControlTime.create({
            employee: existEmployee.employee,
            descanso: this.data.time,
            locations: this.locationId,
          });
          break;
        case "retorno":
          newWorkTime = await ControlTime.create({
            employee: existEmployee.employee,
            retorno: this.data.time,
            locations: this.locationId,
          });
          break;
        case "salida":
          newWorkTime = await ControlTime.create({
            employee: existEmployee.employee,
            salida: this.data.time,
            locations: this.locationId,
          });
          break;
      }
    }
    return newWorkTime;
  }
}

module.exports = { ControlTimeService };
