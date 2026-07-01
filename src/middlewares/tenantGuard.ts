import { Request, Response, NextFunction } from 'express';

const requireSuperuser = (req: Request, res: Response, next: NextFunction) => {
  if (req.userRole !== 'superuser') {
    res.status(403).json({ message: "Acceso denegado: se requiere superusuario" });
    return;
  }
  next();
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

export { requireSuperuser, requireCompanyAccess };