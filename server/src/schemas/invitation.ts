import { z } from 'zod';

export const createInvitationSchema = z.object({
  role: z.enum(['employee', 'hr_manager', 'supervisor', 'admin']).optional().default('employee'),
  maxUses: z.number().min(1).max(1).optional().default(1),
  expiresInDays: z.number().min(1).max(30).optional().default(7),
  username: z.string().min(2).max(100).trim(),
  email: z.string().email().trim().toLowerCase(),
  phone: z.string().max(20).trim().optional(),
  jobTitle: z.string().max(100).trim().optional(),
  targetEmail: z.string().email().trim().toLowerCase().optional(),
  targetPhone: z.string().max(20).trim().optional(),
  departmentId: z.string().regex(/^[a-f\d]{24}$/i, 'departmentId debe ser ObjectId').optional(),
  branchId: z.string().regex(/^[a-f\d]{24}$/i, 'branchId debe ser ObjectId').or(z.string().min(2).max(100)).optional(),
  shiftId: z.string().max(100).trim().optional(),
  shiftLabel: z.string().max(100).trim().optional(),
});

export const requestNewSchema = z.object({
  code: z.string().min(4).max(20).trim(),
  email: z.string().email().trim().toLowerCase().optional(),
  phone: z.string().max(20).trim().optional(),
});
