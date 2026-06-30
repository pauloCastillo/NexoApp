import { Employee, JobTitle, ControlTime } from '../db/models/index.js';

class EmployeeRepository {
    async getAllEmployees() {
       return await Employee.find({}).populate({ 
            path:"controlTimeID", 
            populate:{
                path:"location",
                populate:{
                    path:"locations",
                }
            }
        });
    }

    async getEmployeeById(id) {
        const employee = await Employee.findById(id);
        return employee;
    }

    async getEmployeeByEmail(email) {
        const employee = await Employee.findOne({ email });
        return employee;
    }
    
    async createEmployee(employeeData) {

    const registerNewUser = new Employee(employeeData);
    const savedUser = await registerNewUser.save();

    const createATimeControl = new ControlTime({
        employee: savedUser._id,
    });
    const newJob = new JobTitle({ employee: savedUser._id, job_Title: savedUser.jobTitle});
    await newJob.save();
    await createATimeControl.save();
    savedUser.controlTimeID = createATimeControl._id;
    savedUser.save();
    delete employeeData.password;
    return await this.addTokenToEmployee(savedUser._id);
    }

    async updateEmployee(id, employeeData) {
        const updatedEmployee = await Employee.findByIdAndUpdate(id, employeeData, { new: true });
        return updatedEmployee;
    }

    async deleteEmployee(id) {
        const deletedEmployee = await Employee.findByIdAndDelete(id);
        return deletedEmployee;
    }

    async addTokenToEmployee(id) {
        const user = await this.getEmployeeById(id);
        user.createToken();
        return user.toJSON();
    }
}

export default EmployeeRepository;