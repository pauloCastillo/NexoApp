import { User } from '@/db/models/index.js';
import type { TenantContext } from '@/types/models.js';

class UserService {
  protected _context?: TenantContext;

  constructor(context?: TenantContext) {
    this._context = context;
  }

  #companyFilter(): Record<string, any> {
    return this._context?.role === 'superuser' ? {} : { company: this._context?.companyId };
  }

  async getAll(roleFilter?: string[]) {
    const filter: Record<string, any> = this.#companyFilter();
    if (roleFilter) {
      filter.role = { $in: roleFilter };
    }
    return await User.find(filter);
  }

  async getById(id: string) {
    return await User.findOne({ _id: id, ...this.#companyFilter() });
  }

  async update(id: string, data: Record<string, any>) {
    return await User.findOneAndUpdate({ _id: id, ...this.#companyFilter() }, data, { new: true });
  }

  async delete(id: string) {
    return await User.findOneAndDelete({ _id: id, ...this.#companyFilter() });
  }
}

export default UserService;
