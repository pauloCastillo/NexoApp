import express from 'express';
import { 
  getPermissionsByEmployee,
  createPermission,
 } from '../controllers/permissionsController.js';
import {  verifiedToken  } from '../middlewares/verifyToken.js';

const router = express.Router();

router.get("/:employee_id", verifiedToken, getPermissionsByEmployee);
router.post("/", verifiedToken, createPermission);

export { router };
