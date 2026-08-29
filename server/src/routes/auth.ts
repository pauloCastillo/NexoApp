import express from 'express';
import { register, login, refreshTokenEndpoint, changePassword, logout } from '@/controllers/authController.js';
import { verifiedToken } from '@/middlewares/verifyToken.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshTokenEndpoint);
router.post("/logout", verifiedToken, logout);
router.put("/password", verifiedToken, changePassword);

export { router };
