import express from 'express';
import { 
  getVacationsByEmployee,
  createVacation,
 } from '@/controllers/vacationsController.js';
import { verifiedToken } from '@/middlewares/verifyToken.js';

const router = express.Router();

router.get("/:employee_id", verifiedToken, getVacationsByEmployee);
router.post("/", verifiedToken, createVacation);

export { router };
