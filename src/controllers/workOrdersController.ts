import { Request, Response } from 'express';
import { httpStatusCode } from '@/utils/httpStatus.js';
import ServiceFactory from '@/factories/serviceFactory.js';

async function getWorkOrdersByEmployee(req: Request, res: Response) {
  const { employee_id } = req.params;
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const userType = (req as any).userType;
  const workOrderService = ServiceFactory.getService("workOrder", null, { companyId, role: userRole, userType });
  const workOrders = await workOrderService.getByEmployee(employee_id);
  res.status(httpStatusCode.OK).json({ workOrders });
}

async function createWorkOrder(req: Request, res: Response) {
  const companyId = (req as any).companyId;
  const userRole = (req as any).userRole;
  const userType = (req as any).userType;
  const workOrderService = ServiceFactory.getService("workOrder", req.body, { companyId, role: userRole, userType });
  const workOrder = await workOrderService.create();
  res.status(httpStatusCode.CREATED).json({
    message: "Orden de trabajo registrada exitosamente",
    workOrder,
  });
}

export { getWorkOrdersByEmployee, createWorkOrder,  };
