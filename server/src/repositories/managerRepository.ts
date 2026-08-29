import { User } from '@/db/models/index.js';
import type { TenantContext } from '@/types/models.js';
import { signSession, signRefreshToken, hashToken } from '@/utils/utils.js';

class ManagerRepository {
    #companyFilter(context: TenantContext): Record<string, any> {
        return context.role === 'superuser' ? {} : { company: context.companyId };
    }

    async getAllManagers(context: TenantContext) {
        return await User.find({ ...this.#companyFilter(context), role: { $in: ['superuser', 'platform_admin', 'support', 'business_owner', 'admin', 'supervisor', 'hr_manager'] } });
    }

    async getManagerById(id: string, context: TenantContext) {
        return await User.findOne({ _id: id, ...this.#companyFilter(context) });
    }

    async createManager(managerData: Record<string, any>, context: TenantContext) {
        managerData.company = context.companyId;
        managerData.role = managerData.role || 'admin';
        const user = new User(managerData);
        const savedUser = await user.save();
        delete managerData.password;
        return await this.addTokenToManager(savedUser._id.toString(), context);
    }

    async updateManager(id: string, managerData: Record<string, any>, context: TenantContext) {
        return await User.findOneAndUpdate(
            { _id: id, ...this.#companyFilter(context) },
            managerData,
            { new: true }
        );
    }

    async deleteManager(id: string, context: TenantContext) {
        return await User.findOneAndDelete({ _id: id, ...this.#companyFilter(context) });
    }

    async addTokenToManager(id: string, context: TenantContext) {
        const user = await User.findOne({ _id: id, ...this.#companyFilter(context) });
        const token = signSession({ _id: user!._id, email: user!.email, username: user!.username, company: user!.company, role: user!.role });
        const refreshToken = signRefreshToken({ _id: user!._id });
        user!.refreshTokenHash = await hashToken(refreshToken);
        await user!.save();
        return { id: user!._id, username: user!.username, email: user!.email, role: user!.role, token };
    }
}

export default ManagerRepository;
