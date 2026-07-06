import express from 'express';
import { 
  getWorkOrdersByEmployee,
  createWorkOrder,
  updateWorkOrder,
  deleteWorkOrder,
  startWorkOrder,
  completeWorkOrder,
  cancelWorkOrder,
 } from '@/controllers/workOrdersController.js';
import { verifiedToken } from '@/middlewares/verifyToken.js';

const router = express.Router();

router.get("/:employee_id", verifiedToken, getWorkOrdersByEmployee);
router.post("/", verifiedToken, createWorkOrder);
router.put("/:id", verifiedToken, updateWorkOrder);
router.delete("/:id", verifiedToken, deleteWorkOrder);
router.patch("/:id/start", verifiedToken, startWorkOrder);
router.patch("/:id/complete", verifiedToken, completeWorkOrder);
router.patch("/:id/cancel", verifiedToken, cancelWorkOrder);

export { router };
