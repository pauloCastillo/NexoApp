import express from 'express';
import { getAllCompanies, createCompany, getCompanyById, getMyCompany, listPublicCompanies, updateCompany } from '@/controllers/companiesController.js';
import { verifiedToken } from '@/middlewares/verifyToken.js';
import { requireSuperuser } from '@/middlewares/tenantGuard.js';

const router = express.Router();

router.get("/public", listPublicCompanies);
router.get("/", verifiedToken, getAllCompanies);
router.post("/", verifiedToken, requireSuperuser, createCompany);
router.get("/me", verifiedToken, getMyCompany);
router.get("/:id", verifiedToken, getCompanyById);
router.put("/", verifiedToken, updateCompany);

export { router };
