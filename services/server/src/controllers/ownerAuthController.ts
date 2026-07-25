import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import httpStatusCode from "@/utils/httpStatusCode.js";
import ManagerModel from "@/models/managerModel.js";

async function registerOwner(req: Request, res: Response) {
    const { name, email, password, phone } = req.body;
    // CODIGO para el registro del propietario
    // Verificar primero si el propietario ya existe en la BD.
    // usar zod para la validacion de los datos.
}    
