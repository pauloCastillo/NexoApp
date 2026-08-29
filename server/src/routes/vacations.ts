import express from 'express';
import { 
  getVacationsByEmployee,
  createVacation,
  updateVacation,
  deleteVacation,
 } from '@/controllers/vacationsController.js';
import { verifiedToken } from '@/middlewares/verifyToken.js';
import { requireDeptScope } from '@/middlewares/tenantGuard.js';

const router = express.Router();

router.get("/:employee_id", verifiedToken, getVacationsByEmployee);
router.post("/", verifiedToken, createVacation);
router.put("/:id", verifiedToken, requireDeptScope, updateVacation);
router.delete("/:id", verifiedToken, deleteVacation);

export { router };
