import UserService from '@/services/userService.js';

class ManagerService extends UserService {
  async getAll() {
    return await super.getAll(['superuser', 'platform_admin', 'support', 'business_owner', 'admin', 'supervisor', 'hr_manager']);
  }
}

export default ManagerService;
