import express from 'express';
import {
  registerEmployee,
  loginEmployee,
  refreshTokenEndpoint,
} from '@/controllers/authsController.js';

const router = express.Router();

router.post("/register", registerEmployee);
router.post("/login", loginEmployee);
router.post("/refresh", refreshTokenEndpoint);

export { router };
