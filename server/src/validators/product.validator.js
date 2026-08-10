import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Product description is required'),
  brand: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().optional(),
  thirdLevelCategory: z.string().optional(),
  price: z.coerce.number().min(0),
  oldPrice: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().min(0).default(0),
  isFeatured: z.coerce.boolean().optional(),
  images: z.array(z.object({ url: z.string(), public_id: z.string().optional() })).optional(),
  sizes: z.array(z.string()).optional(),
  weights: z.array(z.string()).optional(),
  rams: z.array(z.string()).optional(),
});

export const productUpdateSchema = productSchema.partial();

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  image: z.object({ url: z.string(), public_id: z.string().optional() }).optional(),
  parentCategory: z.string().nullable().optional(),
  level: z.coerce.number().min(0).max(2).optional(),
  showOnHomeStrip: z.coerce.boolean().optional(),
  order: z.coerce.number().optional(),
});

export const lookupSchema = z.object({
  value: z.string().min(1, 'Value is required'),
});
