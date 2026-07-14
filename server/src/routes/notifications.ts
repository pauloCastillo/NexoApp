import express from 'express';
import { verifiedToken } from '@/middlewares/verifyToken.js';
import { validate } from '@/middlewares/validate.js';
import { registerTokenSchema } from '@/schemas/auth.js';
import PushToken from '@/db/models/pushToken.js';

const router = express.Router();

router.post('/register-token', verifiedToken, validate(registerTokenSchema), async (req, res) => {
  const { token, platform } = req.body;
  const userId = (req as any).employeeId;
  const companyId = (req as any).companyId;

  await PushToken.findOneAndUpdate(
    { userId },
    { token, platform, companyId },
    { upsert: true, new: true }
  );

  res.json({ message: 'Token registrado' });
});

export { router };
