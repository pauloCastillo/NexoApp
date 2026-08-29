import { Document } from 'mongoose';

export type UserRole = 'superuser' | 'platform_admin' | 'support' | 'business_owner' | 'admin' | 'supervisor' | 'hr_manager' | 'employee';

export interface TenantContext {
  userId?: string;
  companyId: string | null;
  role: string;
}

export interface ICompany extends Document {
  name: string;
  isActive: boolean;
  location?: {
    lat: number;
    lng: number;
  };
  geofenceRadius?: number;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  company: any;
  department?: any;
  jobTitle?: string;
  controlTimeID?: any;
  refreshTokenHash?: string;
  isActive: boolean;
  authenticateUser(password: string, id: string): Promise<boolean>;
  createToken(): string;
  toJSON(): {
    id: string;
    username: string;
    email: string;
    role: string;
    token: string;
  };
}

export interface IDepartment extends Document {
  name: string;
  description?: string;
  company: string;
  isActive: boolean;
}

export interface IClient extends Document {
  companyName: string;
  company: string;
  contactName: string;
  contactLastName: string;
  email?: string;
  phone?: string;
  createdBy?: string;
}

export interface IControlTime extends Document {
  employee?: string;
  company: string;
  date: Date;
  entrada?: string;
  descanso?: string;
  retorno?: string;
  salida?: string;
  location?: string;
}

export interface ISubLocation {
  date: Date;
  latitude: number;
  longitude: number;
  street: string;
}

export interface ILocation extends Document {
  employee?: string;
  company: string;
  locations: ISubLocation[];
}

export interface IPermission extends Document {
  employee: string;
  company: string;
  type: 'permiso' | 'licencia' | 'otro';
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'pendiente' | 'aprobado' | 'rechazado';
  attachmentUrl?: string;
}

export interface IVacation extends Document {
  employee: string;
  company: string;
  startDate: Date;
  endDate: Date;
  status: 'pendiente' | 'aprobado' | 'rechazado';
}

export interface IWorkOrder extends Document {
  employee: string;
  company: string;
  client?: string;
  clientName?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  date: Date;
  status: 'pendiente' | 'en_progreso' | 'completado' | 'cancelado';
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}

export interface IAuditLog extends Document {
  action: string;
  entityType: string;
  entityId?: string;
  userId?: string;
  companyId?: string;
  previousValue?: any;
  newValue?: any;
  ipAddress?: string;
  metadata?: any;
  createdAt: Date;
}

export interface IJobTitle extends Document {
  employee: string;
  company: string;
  job_title?: string;
  department: string;
}

export type TimeLabels = 'entrada' | 'descanso' | 'retorno' | 'salida';

export interface ITimeControlData {
  employee: string;
  date?: string;
  label: TimeLabels;
  time: string;
  location: string;
}

export interface ILocationTimeData {
  employee: string;
  date?: string;
  label: TimeLabels;
  time: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  username: string;
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  jobTitle?: string;
}
