import express from 'express';
import { 
  getPermissionsByEmployee,
  createPermission,
  updatePermission,
  deletePermission,
 } from '@/controllers/permissionsController.js';
import { verifiedToken } from '@/middlewares/verifyToken.js';

const router = express.Router();

router.get("/:employee_id", verifiedToken, getPermissionsByEmployee);
router.post("/", verifiedToken, createPermission);
router.put("/:id", verifiedToken, updatePermission);
router.delete("/:id", verifiedToken, deletePermission);

export { router };
