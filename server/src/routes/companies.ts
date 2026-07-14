import express from 'express';
import { getAllCompanies, createCompany, getCompanyById, regenerateInviteCode } from '@/controllers/companiesController.js';
import { verifiedToken } from '@/middlewares/verifyToken.js';
import { requireSuperuser } from '@/middlewares/tenantGuard.js';

const router = express.Router();

router.get("/", verifiedToken, getAllCompanies);
router.post("/", verifiedToken, requireSuperuser, createCompany);
router.get("/:id", verifiedToken, getCompanyById);
router.patch("/:id/invite-code", verifiedToken, requireSuperuser, regenerateInviteCode);

export { router };
