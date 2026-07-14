import { ControlTime } from '@/db/models/index.js';
import { ITimeControlData, TenantContext } from '@/types/models.js';

class TimeControlRepository {
    #companyFilter(context: TenantContext): Record<string, any> {
        return context.role === 'superuser' ? {} : { company: context.companyId };
    }

    async getTimeControlById(id: string, context: TenantContext) {
        return await ControlTime.findOne({ employee: id, ...this.#companyFilter(context) }).populate("employee").populate("location", "locations.street");
    }
    async getAllTimeControls(context: TenantContext) {
        return await ControlTime.find(this.#companyFilter(context)).populate("employee").populate("location");
    }
    async createTimeControl(id: string, data: ITimeControlData, context: TenantContext) {
        const updateData: any = {
            $set: {
                [`${data.label}`]: data.time,
                location: data.location,
            },
        };
        if (context.role !== 'superuser') {
            updateData.$set.company = context.companyId;
        }
        return await ControlTime.findByIdAndUpdate(id, updateData, { new: true }).populate("location", "locations");
    }

    async deleteTimeControl(id: string, context: TenantContext) {
        return await ControlTime.findOneAndDelete({ _id: id, ...this.#companyFilter(context) });
    }
}

export default TimeControlRepository;
