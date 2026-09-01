import UserService from '@/services/userService.js';
import { User, ControlTime, JobTitle } from '@/db/models/index.js';
import { signSession, signRefreshToken, hashToken } from '@/utils/utils.js';

// ponytail: composition over inheritance — keep extends for backward compat but delegate to UserService internally
class EmployeeService extends UserService {
  private _userService: UserService;

  constructor(context?: any) {
    super(context);
    this._userService = new UserService(context);
  }

  async getAll() {
    return await this._userService.getAll(['employee', 'supervisor', 'admin', 'hr_manager', 'business_owner']);
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
