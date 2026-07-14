import { z } from 'zod';

export const createEmployeeSchema = z.object({
  username: z.string().min(2).max(50).trim(),
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  role: z.enum(['employee', 'editor', 'manager']).optional(),
});
