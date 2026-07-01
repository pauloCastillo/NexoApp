import { createReport } from '@/report/index.js';
import { ControlTime } from '@/db/models/index.js';

class Report {
  async createReport(context?: { companyId?: string | null; role?: string }) {
    const filter: Record<string, any> = {};
    if (context?.role !== 'superuser' && context?.companyId) {
      filter.company = context.companyId;
    }
    const registers = await ControlTime.find(filter).populate("locations", "street").populate("employee", "username");
    createReport(registers as any);
  }
}

export { Report };
