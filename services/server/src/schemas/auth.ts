import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(2).max(50).trim(),
  companyName: z.string().min(1).max(100).trim(),
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  inviteCode: z.string().min(1).max(20).toUpperCase(),
});

export const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(1),
});

export const registerTokenSchema = z.object({
  token: z.string().min(1),
  platform: z.enum(['expo', 'fcm', 'apns']),
});
