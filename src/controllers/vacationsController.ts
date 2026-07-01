import { Request, Response } from 'express';
import { httpStatusCode } from '@/utils/httpStatus.js';
import ServiceFactory from '@/factories/serviceFactory.js';

async function getVacationsByEmployee(req: Request, res: Response) {
  const { employee_id } = req.params;
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const userType = (req as any).userType;
  const vacationService = ServiceFactory.getService("vacation", null, { companyId, role: userRole, userType });
  const vacations = await vacationService.getByEmployee(employee_id);
  res.status(httpStatusCode.OK).json({ vacations });
}

async function createVacation(req: Request, res: Response) {
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const userType = (req as any).userType;
  const vacationService = ServiceFactory.getService("vacation", req.body, { companyId, role: userRole, userType });
  const vacation = await vacationService.create();
  res.status(httpStatusCode.CREATED).json({
    message: "Solicitud de vacación enviada exitosamente",
    vacation,
  });
}

export { getVacationsByEmployee, createVacation,  };
