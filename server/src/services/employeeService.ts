import UserService from '@/services/userService.js';
import { User, ControlTime, JobTitle } from '@/db/models/index.js';
import type { TenantContext } from '@/types/models.js';
import { signSession, signRefreshToken, hashToken } from '@/utils/utils.js';

class EmployeeService extends UserService {
  constructor(context?: TenantContext) {
    super(context);
  }

  async getAll() {
    return await super.getAll(['employee', 'editor', 'manager', 'it', 'hr']);
  }

  async create(employeeData: Record<string, any>) {
    employeeData.company = this._context?.companyId;
    employeeData.role = employeeData.role || 'employee';
    const user = new User(employeeData);
    const saved = await user.save();

    const timeControl = new ControlTime({ employee: saved._id, company: this._context?.companyId });
    await timeControl.save();

    if (saved.jobTitle) {
      const job = new JobTitle({ employee: saved._id, company: this._context?.companyId, job_title: saved.jobTitle });
      await job.save();
    }

    saved.controlTimeID = String(timeControl._id);
    await saved.save();

    const userData = { _id: saved._id, email: saved.email, username: saved.username, company: saved.company, role: saved.role };
    const token = signSession(userData);
    const refreshToken = signRefreshToken(userData);
    saved.refreshTokenHash = await hashToken(refreshToken);
    await saved.save();

    return { id: saved._id, username: saved.username, email: saved.email, role: saved.role, token };
  }
}

export default EmployeeService;
