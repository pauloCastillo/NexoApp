import { Vacation } from '@/db/models/index.js';
import { TenantContext } from '@/types/models.js';

class VacationRepository {
  #companyFilter(context: TenantContext): Record<string, any> {
    return context.role === 'superuser' ? {} : { company: context.companyId };
  }

  async getVacationsByEmployee(employeeId: string, context: TenantContext) {
    return await Vacation.find({ employee: employeeId, ...this.#companyFilter(context) }).sort({ createdAt: -1 });
  }

  async createVacation(vacationData: Record<string, any>, context: TenantContext) {
    vacationData.company = context.companyId;
    const newVacation = new Vacation(vacationData);
    return await newVacation.save();
  }

  async updateVacation(id: string, data: Record<string, any>, context: TenantContext) {
    return await Vacation.findOneAndUpdate(
      { _id: id, ...this.#companyFilter(context) },
      data,
      { new: true }
    );
  }

  async deleteVacation(id: string, context: TenantContext) {
    return await Vacation.findOneAndDelete({ _id: id, ...this.#companyFilter(context) });
  }
}

export default VacationRepository;
