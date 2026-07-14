import { z } from 'zod';

export const createClientSchema = z.object({
  companyName: z.string().min(1).max(100).trim(),
  contactName: z.string().min(1).max(50).trim(),
  contactLastName: z.string().min(1).max(50).trim(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});
