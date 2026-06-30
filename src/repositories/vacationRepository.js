import {  Vacation  } from '../db/models/index.js';

class VacationRepository {
  async getVacationsByEmployee(employeeId) {
    return await Vacation.find({ employee: employeeId }).sort({ createdAt: -1 });
  }

  async createVacation(vacationData) {
    const newVacation = new Vacation(vacationData);
    return await newVacation.save();
  }
}

export default VacationRepository;
