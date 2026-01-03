import { getPropertiesQuery } from "@/components/property/queries";
import { z } from "zod";

const gallerySchema = z.array(z.union([z.instanceof(File), z.string()]));

export const propertySchema = z.object({
  info: z.object({
    name: z.string().min(1),
    description: z.string().min(1).optional(),
    rooms: z.number().min(1),
    bathrooms: z.number().min(0),
    guests: z.number().min(1),
    cancellationPolicy: z.string().optional(),
  }),
  services: z.array(z.string()).default([]),
  gallery: gallerySchema.default([]),
  position: z
    .object({
      address: z.string().min(1),
      city: z.string().min(1),
      country: z.string().min(1),
    })
    .optional(),
  contact: z
    .object({
      name: z.string().optional(),
      email: z.email().optional(),
      phone: z.string().optional(),
    })
    .optional(),
});

export type PropertySchema = z.infer<typeof propertySchema>;
export type PropertyFormValues = z.input<typeof propertySchema>;

export type Property = NonNullable<
  Awaited<ReturnType<typeof getPropertiesQuery>>
>[number];

export type PropertyWithDetails = Property & {
  details: PropertySchema;
};
