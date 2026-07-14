import AuditLog from '@/db/models/auditLog.js';
import type { TenantContext } from '@/types/models.js';

interface AuditEntry {
  action: string;
  entityType: string;
  entityId?: string;
  userId?: string;
  companyId?: string;
  previousValue?: any;
  newValue?: any;
  ipAddress?: string;
  metadata?: any;
}

class AuditLogService {
  async log(entry: AuditEntry) {
    await AuditLog.create(entry);
  }

  async query(companyId?: string, context?: TenantContext) {
    const filter: Record<string, any> = {};
    if (companyId) {
      if (context?.role !== 'superuser') {
        filter.companyId = context?.companyId || companyId;
      } else {
        filter.companyId = companyId;
      }
    } else if (context?.companyId) {
      filter.companyId = context.companyId;
    }
    return await AuditLog.find(filter).sort({ createdAt: -1 }).limit(200);
  }
}

const auditLogService = new AuditLogService();
export default auditLogService;