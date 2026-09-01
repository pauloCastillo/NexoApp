import express from 'express';
import { verifiedToken } from '@/middlewares/verifyToken.js';
import { requireCompanyAccess } from '@/middlewares/tenantGuard.js';
import { listBranches, getBranch, createBranch, updateBranch, deleteBranch } from '@/controllers/branchesController.js';

const router = express.Router();

router.use(verifiedToken, requireCompanyAccess);

router.get('/', listBranches);
router.post('/', createBranch);
router.get('/:id', getBranch);
router.put('/:id', updateBranch);
router.delete('/:id', deleteBranch);

export { router };
