import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const getToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(" ").pop();
  return token || null;
};

const verifiedToken = (req: Request, res: Response, next: NextFunction) => {
  const token = getToken(req);
  if (!token) {
    res.status(401).json({ message: "token required" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as Record<string, any>;
    req.employeeId = decoded.employeeId;
    req.companyId = decoded.companyId;
    req.userRole = decoded.role;
    req.userType = decoded.userType;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export { verifiedToken };
