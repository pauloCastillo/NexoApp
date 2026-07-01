import { Permission } from '@/db/models/index.js';
import { IPermission, TenantContext } from '@/types/models.js';

class PermissionRepository {
  #companyFilter(context: TenantContext): Record<string, any> {
    return context.role === 'superuser' ? {} : { company: context.companyId };
  }

  async getPermissionsByEmployee(employeeId: string, context: TenantContext) {
    return await Permission.find({ employee: employeeId, ...this.#companyFilter(context) }).sort({ createdAt: -1 });
  }

  async createPermission(permissionData: Record<string, any>, context: TenantContext) {
    permissionData.company = context.companyId;
    const newPermission = new Permission(permissionData);
    return await newPermission.save();
  }
}

export default PermissionRepository;
