import { User, ControlTime, JobTitle } from '@/db/models/index.js';
import type { TenantContext } from '@/types/models.js';
import { signSession, signRefreshToken, hashToken } from '@/utils/utils.js';

class EmployeeRepository {
    #companyFilter(context: TenantContext): Record<string, any> {
        return context.role === 'superuser' ? {} : { company: context.companyId };
    }

    async getAllEmployees(context: TenantContext) {
        return await User.find({ ...this.#companyFilter(context), role: { $in: ['employee', 'editor', 'manager', 'it', 'hr'] } }).populate({
            path: "controlTimeID",
            populate: {
                path: "location",
                populate: {
                    path: "locations",
                }
            }
        });
    }

    async getEmployeeById(id: string, context: TenantContext) {
        return await User.findOne({ _id: id, ...this.#companyFilter(context) });
    }

    async getEmployeeByEmail(email: string, context: TenantContext) {
        return await User.findOne({ email, ...this.#companyFilter(context) });
    }

    async createEmployee(employeeData: Record<string, any>, context: TenantContext) {
        employeeData.company = context.companyId;
        employeeData.role = employeeData.role || 'employee';
        const registerNewUser = new User(employeeData);
        const savedUser = await registerNewUser.save();

        const createATimeControl = new ControlTime({
            employee: savedUser._id,
            company: context.companyId,
        });
        const newJob = new JobTitle({ employee: savedUser._id, company: context.companyId, job_title: savedUser.jobTitle });
        await newJob.save();
        await createATimeControl.save();
        savedUser.controlTimeID = String(createATimeControl._id);
        await savedUser.save();
        delete employeeData.password;
        return await this.addTokenToEmployee(savedUser._id.toString(), context);
    }

    async updateEmployee(id: string, employeeData: Record<string, any>, context: TenantContext) {
        return await User.findOneAndUpdate(
            { _id: id, ...this.#companyFilter(context) },
            employeeData,
            { new: true }
        );
    }

    async deleteEmployee(id: string, context: TenantContext) {
        return await User.findOneAndDelete({ _id: id, ...this.#companyFilter(context) });
    }

    async addTokenToEmployee(id: string, context: TenantContext) {
        const user = await this.getEmployeeById(id, context);
        const token = signSession({ _id: user!._id, email: user!.email, username: user!.username, company: user!.company, role: user!.role });
        const refreshToken = signRefreshToken({ _id: user!._id });
        user!.refreshTokenHash = await hashToken(refreshToken);
        await user!.save();
        return { id: user!._id, username: user!.username, email: user!.email, role: user!.role, token };
    }
}

export default EmployeeRepository;
