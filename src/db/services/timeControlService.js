const { ControlTime } = require("../models");
class ControlTimeService {
  #timingRegister = {};

  constructor(data, idLocation, employeeId) {
    this.data = data;
    this.locationId = idLocation;
    this.employeeId = employeeId;
  }

  async #registerTiming(register, existEmployee) {
    switch (existEmployee.label){
      case "entrada":
        register.entrada = existEmployee.time;
        register.locations = this.locationId;
        this.#timingRegister = register;
        break;
      case "descanso":
        register.descanso = existEmployee.time;
        register.locations = this.locationId;
        this.#timingRegister = register;
        break;
      case "retorno":
        register.retorno = existEmployee.time;
        register.locations = this.locationId;
        this.#timingRegister = register;
        break;
      case "salida":
        register.salida = existEmployee.time;
        register.locations = this.locationId;
        this.#timingRegister = register;
        break;
    }
    // this.#timingRegister = await ControlTime.findOne({employee: this.employeeId}).then(data => {
    //   switch (existEmployee.label) {
    //     case "entrada":
    //       data.entrada = existEmployee.time;
    //       data.locations = this.locationId;
    //       return data.save()
    //     case "descanso":
    //         data.descanso = existEmployee.time;
    //         data.locations = this.locationId;
    //       return data.save();
    //     case "retorno":
    //         data.retorno = existEmployee.time;
    //         data.locations = this.locationId;
    //       return data.save();
    //     case "salida":
    //         data.salida = existEmployee.time;
    //         data.locations = this.locationId;
    //       return data.save();
    //   }
    // });
    return this.#timingRegister;
  }

  async timeRegister() {
    const getEmployees = await ControlTime.schema.methods.getEmployees();
    if (getEmployees.length === 0) {
      return "No existen empleados registrados en la base de datos";
    }
    const register = await ControlTime.findOneAndUpdate({ employee: this.employeeId }).then(async data => {
      if(!data){
        throw Error("No existe empleado");
      }
      return await this.#registerTiming(data, this.data);
    })
    return register.save();
  }
}

module.exports = {
  ControlTimeService,
};
