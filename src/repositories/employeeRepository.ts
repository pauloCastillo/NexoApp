import { Employee, JobTitle, ControlTime } from '@/db/models/index.js';
import { IEmployee, TenantContext } from '@/types/models.js';

class EmployeeRepository {
    #companyFilter(context: TenantContext): Record<string, any> {
        return context.role === 'superuser' ? {} : { company: context.companyId };
    }

    async getAllEmployees(context: TenantContext) {
        return await Employee.find(this.#companyFilter(context)).populate({
            path: "controlTimeID",
            populate: {
                path: "location",
                populate: {
                    path: "locations",
                }
            }
        });
    }

    async getEmployeeById(id: string, context: TenantContext): Promise<IEmployee | null> {
        const employee = await Employee.findOne({ _id: id, ...this.#companyFilter(context) });
        return employee;
    }

    async getEmployeeByEmail(email: string, context: TenantContext) {
        const employee = await Employee.findOne({ email, ...this.#companyFilter(context) });
        return employee;
    }

    async createEmployee(employeeData: Record<string, any>, context: TenantContext) {
        employeeData.company = context.companyId;
        const registerNewUser = new Employee(employeeData);
        const savedUser = await registerNewUser.save();

        const createATimeControl = new ControlTime({
            employee: savedUser._id,
        });
        const newJob = new JobTitle({ employee: savedUser._id, job_Title: savedUser.jobTitle });
        await newJob.save();
        await createATimeControl.save();
        savedUser.controlTimeID = String(createATimeControl._id);
        await savedUser.save();
        delete employeeData.password;
        return await this.addTokenToEmployee(savedUser._id.toString(), context);
    }

    async updateEmployee(id: string, employeeData: Partial<IEmployee>, context: TenantContext) {
        const updatedEmployee = await Employee.findOneAndUpdate(
            { _id: id, ...this.#companyFilter(context) },
            employeeData,
            { new: true }
        );
        return updatedEmployee;
    }

    async deleteEmployee(id: string, context: TenantContext) {
        const deletedEmployee = await Employee.findOneAndDelete({ _id: id, ...this.#companyFilter(context) });
        return deletedEmployee;
    }

    async addTokenToEmployee(id: string, context: TenantContext) {
        const user = await this.getEmployeeById(id, context);
        user!.createToken();
        return user!.toJSON();
    }
}

export default EmployeeRepository;
