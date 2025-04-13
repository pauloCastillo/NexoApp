const {Employee, JobTitle, ControlTime} = require("../db/models");

class EmployeeRepository {
    async getAllEmployees() {
        const employees = await Employee.find().populate("department");
        return employees;
    }

    async getEmployeeById(id) {
        const employee = await Employee.findById(id);
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
    async loginChecking(employeeData, id) {
        const findingUser = await Employee.findOne({ mail: employeeData.mail });
        if (!findingUser) {
            throw new Error("User not found");
        }
    
        return await findingUser.authenticateUser(employeeData.password, id);
    }
}

module.exports = EmployeeRepository;