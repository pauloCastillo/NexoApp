import {  Permission  } from '../db/models/index.js';

class PermissionRepository {
  async getPermissionsByEmployee(employeeId) {
    return await Permission.find({ employee: employeeId }).sort({ createdAt: -1 });
  }

  async createPermission(permissionData) {
    const newPermission = new Permission(permissionData);
    return await newPermission.save();
  }
}

export default PermissionRepository;
