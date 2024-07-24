const { ControlTime } = require("../models");
const { Employee } = require("../models");
const createReport = require("../../report/report");

class RegisterUserAndTimeService {
  async CreateEmployee(user) {
    const newEmployeeRegister = new Employee(user);
    const savedNewEmployee = await newEmployeeRegister.save();
    savedNewEmployee.methods.createToken();
    const createATimeControl = new ControlTime({
      employee: savedNewEmployee._id,
    });
    await createATimeControl.save();
    delete user.password;
    return savedNewEmployee;
  }

  async timeRegister(data, locationId, employeeID) {
    const employees = await ControlTime.schema.methods.getEmployees();
    const existEmployee = employees.find(
      (item) => item.employee.toString() === employeeID.toString()
    );
    let newWorkTime;
    if (!existEmployee && employees.length === 0) {
      throw Error("No existe trabajadores en la base de datos");
    } else if (!existEmployee && employees.length !== 0) {
      return employees;
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

  async createReport() {
    const registers = await ControlTime.find().populate(
      ["employee", "locations"],
      ["username"]
    );
    console.log(registers);
    // createReport(registers);
  }
}

module.exports = { RegisterUserAndTimeService };
