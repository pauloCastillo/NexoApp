import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string().min(1).max(100).trim(),
});

export const timeControlSchema = z.object({
  employee: z.string().min(1),
  date: z.string().optional(),
  label: z.enum(['entrada', 'descanso', 'retorno', 'salida']),
  time: z.string().min(1),
  location: z.string().min(1).optional(),
});
