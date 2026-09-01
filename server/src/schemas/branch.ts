import { z } from 'zod';

export const createBranchSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  address: z.string().max(300).trim().optional(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  geofenceRadius: z.number().min(50).max(2000).optional().default(200),
  geofenceType: z.enum(['circle']).optional().default('circle'),
  reason: z.string().max(300).trim().optional(),
});

export const updateBranchSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  address: z.string().max(300).trim().optional(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
  geofenceRadius: z.number().min(50).max(2000).optional(),
  geofenceType: z.enum(['circle']).optional(),
  reason: z.string().min(1).max(300).trim().optional(),
});

export const assignBranchesSchema = z.object({
  branchIds: z.array(z.string().regex(/^[a-f\d]{24}$/i, 'branchId debe ser ObjectId')).max(10),
  reason: z.string().max(300).trim().optional(),
});
