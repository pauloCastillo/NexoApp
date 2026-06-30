import express from 'express';
import { 
  getWorkOrdersByEmployee,
  createWorkOrder,
 } from '../controllers/workOrdersController.js';
import {  verifiedToken  } from '../middlewares/verifyToken.js';

const router = express.Router();

router.get("/:employee_id", verifiedToken, getWorkOrdersByEmployee);
router.post("/", verifiedToken, createWorkOrder);

export { router };
