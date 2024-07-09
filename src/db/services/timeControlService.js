const { ControlTime } = require("../models");
const { Employee } = require("../models");

class RegisterUserAndTimeService {
  async CreateEmployee(user) {
    const newEmployeeRegister = new Employee(user);
    const savedNewEmployee = await newEmployeeRegister.save();

    const createATimeControl = new ControlTime({
      employee: savedNewEmployee._id,
    });
    await createATimeControl.save();
    return savedNewEmployee;
  }

  async timeRegister(data, locationId, employeeID) {
    const employees = await ControlTime.schema.methods.getEmployees();
    const existEmployee = employees.find(
      (item) => item.employee.toString() === employeeID.toString()
    );
    let newWorkTime;
    if (!existEmployee) {
      throw new Error("No existe usuario");
    } else {
      switch (data.label) {
        case "entrada":
          newWorkTime = await ControlTime.findOneAndUpdate(
            { employee: existEmployee.employee },
            { entrada: data.time, locations: locationId }
          );
          break;
        case "descanso":
          newWorkTime = await ControlTime.findOneAndUpdate(
            { employee: existEmployee.employee },
            { descanso: data.time, locations: locationId }
          );
          break;
        case "retorno":
          newWorkTime = await ControlTime.findOneAndUpdate(
            { employee: existEmployee.employee },
            { retorno: data.time, locations: locationId }
          );
          break;
        case "salida":
          newWorkTime = await ControlTime.findOneAndUpdate(
            { employee: existEmployee.employee },
            { salida: data.time, locations: locationId }
          );
          break;
      }
    }
    return newWorkTime;
  }
}

module.exports = { RegisterUserAndTimeService };
