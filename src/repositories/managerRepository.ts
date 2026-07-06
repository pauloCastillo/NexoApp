import { ManagerModel } from '@/db/models/index.js';
import { IManager, TenantContext } from '@/types/models.js';

class ManagerRepository {
    #companyFilter(context: TenantContext): Record<string, any> {
        return context.role === 'superuser' ? {} : { company: context.companyId };
    }

    async getAllManagers(context: TenantContext) {
        const managers = await ManagerModel.find(this.#companyFilter(context)).populate("department");
        return managers;
    }

    async getManagerById(managerData: { email: string; password: string }, context: TenantContext) {
        const foundManager = await ManagerModel.findOne({ email: managerData.email, ...this.#companyFilter(context) });
        if (!foundManager) {
            throw new Error("Usuario no encontrado");
        }
        const verifiedManager = await ManagerModel.schema.methods.authenticateUser(managerData.password, foundManager._id.toString());
        if (!verifiedManager) {
            throw new Error("La contraseña no coincide con el correo");
        }
        delete (managerData as any).password;
        return foundManager;
    }

    async createManager(managerData: Record<string, any>, context: TenantContext) {
        managerData.company = context.companyId;
        const registerNewUser = new ManagerModel(managerData);
        const savedUser = await registerNewUser.save();
        delete managerData.password;
        return await this.addTokenToManager(savedUser._id.toString(), context);
    }

    async updateManager(id: string, managerData: Partial<IManager>, context: TenantContext) {
        const updatedManager = await ManagerModel.findOneAndUpdate(
            { _id: id, ...this.#companyFilter(context) },
            managerData,
            { new: true }
        );
        return updatedManager;
    }

    async deleteManager(id: string, context: TenantContext) {
        const deletedManager = await ManagerModel.findOneAndDelete({ _id: id, ...this.#companyFilter(context) });
        return deletedManager;
    }

    async addTokenToManager(id: string, context: TenantContext) {
        const user = await ManagerModel.findOne({ _id: id, ...this.#companyFilter(context) });
        user!.createToken();
        return user!.toJSON();
    }
}

export default ManagerRepository;
