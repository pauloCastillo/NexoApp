import express from 'express';
import { getAuditLogs } from '@/controllers/auditLogsController.js';
import { verifiedToken } from '@/middlewares/verifyToken.js';

const router = express.Router();

router.get("/", verifiedToken, getAuditLogs);

export { router };