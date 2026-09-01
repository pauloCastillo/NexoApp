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
import { validate } from '@/middlewares/validate.js';
import { z } from 'zod';

const workOrderCreateSchema = z.object({
  employee: z.string().min(1),
  description: z.string().min(1).max(500).optional(),
  client: z.string().optional(),
  location: z.object({ latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180) }).optional(),
});

const router = express.Router();

router.get("/:employee_id", verifiedToken, getWorkOrdersByEmployee);
router.post("/", verifiedToken, validate(workOrderCreateSchema), createWorkOrder);
router.put("/:id", verifiedToken, validate(workOrderCreateSchema.partial()), updateWorkOrder);
router.delete("/:id", verifiedToken, deleteWorkOrder);
router.patch("/:id/start", verifiedToken, startWorkOrder);
router.patch("/:id/complete", verifiedToken, completeWorkOrder);
router.patch("/:id/cancel", verifiedToken, cancelWorkOrder);

export { router };
