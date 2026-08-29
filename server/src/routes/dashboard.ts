import express from 'express';
import { getSummary, getTodayAttendance } from '@/controllers/dashboardController.js';
import { verifiedToken } from '@/middlewares/verifyToken.js';

const router = express.Router();

router.get("/summary", verifiedToken, getSummary);
router.get("/attendance/today", verifiedToken, getTodayAttendance);

export { router };
