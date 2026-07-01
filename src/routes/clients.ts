import express from 'express';
import { 
  getAllClients,
  createClient,
 } from '@/controllers/clientsController.js';
import { verifiedToken } from '@/middlewares/verifyToken.js';

const router = express.Router();

router.route("/")
  .get(verifiedToken, getAllClients)
  .post(verifiedToken, createClient);

export { router };
