import { Vacation } from '@/db/models/index.js';
import { IVacation, TenantContext } from '@/types/models.js';

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
}

export default VacationRepository;
