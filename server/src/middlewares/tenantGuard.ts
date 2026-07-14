import { Request, Response, NextFunction } from 'express';

const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.userRole!)) {
      res.status(403).json({ message: `Acceso denegado: se requiere uno de los roles: ${roles.join(', ')}` });
      return;
    }
    next();
  };
};

const requireSuperuser = (req: Request, res: Response, next: NextFunction) => {
  return requireRole('superuser')(req, res, next);
};

const requireCompanyAccess = (req: Request, res: Response, next: NextFunction) => {
  const companyId = req.companyId;
  const role = req.userRole;

  if (role === 'superuser') {
    return next();
  }

  const targetCompany = req.params.companyId || req.body.company || req.query.company;
  if (targetCompany && targetCompany !== companyId) {
    res.status(403).json({ message: "Acceso denegado: no pertenece a esta empresa" });
    return;
  }

  next();
};

export { requireRole, requireSuperuser, requireCompanyAccess };