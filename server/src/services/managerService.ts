import UserService from '@/services/userService.js';
import type { TenantContext } from '@/types/models.js';

class ManagerService extends UserService {
  constructor(context?: TenantContext) {
    super(context);
  }

  async getAll() {
    return await super.getAll(['superuser', 'platform_admin', 'support', 'business_owner', 'admin', 'supervisor', 'hr_manager']);
  }
}

export default ManagerService;
