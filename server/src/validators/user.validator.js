import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  countryCode: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export const addressSchema = z.object({
  addressLine1: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(1),
  country: z.string().min(1),
  countryCode: z.string().optional(),
  phone: z.string().min(1),
  landmark: z.string().optional(),
  addressType: z.enum(['Home', 'Office']).optional(),
  isDefault: z.boolean().optional(),
});
