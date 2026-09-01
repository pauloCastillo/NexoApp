import { Request, Response, NextFunction } from 'express';

const ADMIN_LIKE_ROLES = ['business_owner', 'admin', 'supervisor', 'hr_manager', 'platform_admin', 'superuser'] as const;
const isAdminLike = (role?: string) => ADMIN_LIKE_ROLES.includes(role as any);

const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.userRole!)) {
      res.status(403).json({ message: `Acceso denegado: se requiere uno de los roles: ${roles.join(', ')}` });
      return;
    }
    next();
  };
};

// Supervisor only within own department
const requireDeptScope = async (req: Request, res: Response, next: NextFunction) => {
  if (req.userRole !== 'supervisor') return next();
  // Lazy check: if target employee id is present, verify department match
  const targetEmployeeId = req.params.employee_id || req.body.employee || req.params.id;
  if (!targetEmployeeId) return next();
  try {
    const { User } = await import('@/db/models/index.js');
    const target = await User.findById(targetEmployeeId).select('department').lean() as any;
    const me = await User.findById((req as any).userId).select('department').lean() as any;
    if (target && me && target.department?.toString() !== me.department?.toString()) {
      res.status(403).json({ message: 'Acceso denegado: fuera de tu departamento' });
      return;
    }
  } catch (err) { (await import('@/utils/logger.js')).default.debug({ err }, 'requireDeptScope check failed'); }
  next();
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

export { requireRole, requireSuperuser, requireCompanyAccess, isAdminLike, ADMIN_LIKE_ROLES, requireDeptScope };
