import { getPropertiesQuery } from "@/components/property/queries";
import { landingSchema } from "@/components/property/landing-config";
import { z } from "zod";

const gallerySchema = z.array(z.union([z.instanceof(File), z.string()]));
const optionalUrlSchema = z.string().trim().url().optional().or(z.literal(""));

export const propertySchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().min(1),
  info: z.object({
    name: z.string().min(1),
    description: z.string().min(1).optional(),
    rooms: z.number().min(1),
    bathrooms: z.number().min(0),
    guests: z.number().min(1),
    houseRules: z.string().optional(),
    cancellationPolicy: z.string().optional(),
  }),
  services: z.array(z.string()).default([]),
  gallery: gallerySchema.default([]),
  position: z
    .object({
      address: z.string().min(1),
      city: z.string().min(1),
      country: z.string().min(1),
      lat: z.number().optional(),
      lng: z.number().optional(),
    })
    .optional(),
  contact: z
    .object({
      name: z.string().optional(),
      email: z.email().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  booking: z
    .object({
      icalUrl: optionalUrlSchema,
      bookingUrl: optionalUrlSchema,
    })
    .optional(),
  faqs: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
      })
    )
    .optional(),
  landing: landingSchema,
  template: z.string().optional(),
});

export type PropertySchema = z.infer<typeof propertySchema>;
export type PropertyDetailsSchema = Omit<PropertySchema, "template">;
export type PropertyFormValues = z.input<typeof propertySchema>;

export type Property = NonNullable<
  Awaited<ReturnType<typeof getPropertiesQuery>>
>[number];

export type PropertyWithDetails = Property & {
  details: PropertyDetailsSchema;
};

export const createOwnerUserSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type CreateOwnerUserSchema = z.infer<typeof createOwnerUserSchema>;
