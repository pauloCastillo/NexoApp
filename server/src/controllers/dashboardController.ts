import { Request, Response } from 'express';
import { proxyController } from '@/utils/proxyController.js';
import { httpStatusCode } from '@/utils/httpStatus.js';
import User from '@/db/models/user.js';
import ControlTime from '@/db/models/timeControl.js';
import Permission from '@/db/models/permission.js';
import WorkOrder from '@/db/models/workOrder.js';

async function _raw_getSummary(req: Request, res: Response) {
  const companyId = (req as any).companyId;
  if (!companyId) {
    return res.status(httpStatusCode.BAD_REQUEST).json({ message: 'companyId requerido' });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [activeEmployees, todayAttendances, pendingPermissions, activeWorkOrders] = await Promise.all([
    User.countDocuments({ company: companyId }),
    ControlTime.countDocuments({ company: companyId, date: { $gte: today, $lt: tomorrow } }),
    Permission.countDocuments({ company: companyId, status: 'pendiente' }),
    WorkOrder.countDocuments({ company: companyId, status: { $in: ['pendiente', 'en_progreso'] } }),
  ]);

  res.json({ activeEmployees, todayAttendances, pendingPermissions, activeWorkOrders });
}

async function _raw_getTodayAttendance(req: Request, res: Response) {
  const companyId = (req as any).companyId;
  if (!companyId) {
    return res.status(httpStatusCode.BAD_REQUEST).json({ message: 'companyId requerido' });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const attendances = await ControlTime.find({ company: companyId, date: { $gte: today, $lt: tomorrow } })
    .populate('employee', 'username email');

  const result = attendances.map((record: any) => ({
    _id: record._id,
    employee: { _id: record.employee?._id, username: record.employee?.username, email: record.employee?.email },
    date: record.date,
    entrada: record.entrada,
    descanso: record.descanso,
    retorno: record.retorno,
    salida: record.salida,
  }));

  res.json({ attendances: result });
}

const _handlers = { getSummary: _raw_getSummary, getTodayAttendance: _raw_getTodayAttendance };
const _proxied: any = proxyController(_handlers as any);
export const getSummary = _proxied.getSummary;
export const getTodayAttendance = _proxied.getTodayAttendance;

