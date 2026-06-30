import express from 'express';
import { 
  registerEmployee,
  loginEmployee,
 } from '../controllers/authsController.js';

import {  verifiedToken  } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post("/register", registerEmployee);
router.post("/login", verifiedToken, loginEmployee);

export { router };
