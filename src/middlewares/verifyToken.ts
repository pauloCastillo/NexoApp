import { Request, Response, NextFunction } from 'express';
import { verifyingSession } from '@/utils/utils.js';

const verifiedToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "token required" });
    return;
  }

  const token = authHeader.split(" ").pop();
  if (!token) {
    res.status(401).json({ message: "token required" });
    return;
  }

  const decoded = verifyingSession(token);

  if (decoded.error) {
    res.status(401).json({ message: decoded.error });
    return;
  }

  req.employeeId = decoded.employeeId;
  req.companyId = decoded.companyId;
  req.userRole = decoded.role;
  req.userType = decoded.userType;

  next();
};

export { verifiedToken };
