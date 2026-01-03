import { z } from "zod";

export const propertySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1).optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  rooms: z.number().min(1),
  bathrooms: z.number().min(0),
  guests: z.number().min(1),
  services: z.array(z.string()).default([]).optional(),
  gallery: z.array(z.instanceof(File)).optional(),
});

export type PropertySchema = z.infer<typeof propertySchema>;
