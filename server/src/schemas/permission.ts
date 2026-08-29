import { z } from 'zod';

export const createPermissionSchema = z.object({
  employee: z.string().optional(),
  company: z.string().optional(),
  type: z.enum(['permiso', 'licencia', 'otro']).default('permiso'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  reason: z.string().min(3).max(500).trim(),
  status: z.enum(['pendiente', 'aprobado', 'rechazado']).optional(),
  attachmentUrl: z.string().url().max(500).optional(),
}).refine((d) => d.endDate >= d.startDate, { message: 'endDate debe ser >= startDate', path: ['endDate'] });

export const updatePermissionSchema = z.object({
  status: z.enum(['pendiente', 'aprobado', 'rechazado']).optional(),
  attachmentUrl: z.string().url().max(500).optional(),
}).partial();
