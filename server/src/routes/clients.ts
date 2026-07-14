import express from 'express';
import { 
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
 } from '@/controllers/clientsController.js';
import { verifiedToken } from '@/middlewares/verifyToken.js';

const router = express.Router();

router.route("/")
  .get(verifiedToken, getAllClients)
  .post(verifiedToken, createClient);

router.route("/:id")
  .put(verifiedToken, updateClient)
  .delete(verifiedToken, deleteClient);

export { router };
