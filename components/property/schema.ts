import { getPropertiesQuery } from "@/components/property/queries";
import { landingSchema } from "@/components/property/landing-config";
import { z } from "zod";

const gallerySchema = z
  .array(z.union([z.instanceof(File), z.string()]))
  .max(20, "Massimo 20 immagini");
const optionalUrlSchema = z.string().trim().url().optional().or(z.literal(""));
const editorialImageSchema = z.union([
  z.instanceof(File),
  z.string().trim().url(),
  z.literal(""),
]);
const editorialBlockSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  body: z.string().min(1),
  image: editorialImageSchema.optional(),
  imageAlt: z.string().optional(),
});

export const propertySchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().min(1),
  info: z.object({
    name: z.string().min(1),
    description: z.string().min(1).optional(),
    rooms: z.number().min(1),
    bathrooms: z.number().min(0),
    guests: z.number().min(1),
  }),
  services: z.array(z.string()).default([]),
  gallery: gallerySchema.default([]),
  position: z
    .object({
      address: z.string().min(1),
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
      bookingUrl: optionalUrlSchema,
    })
    .optional(),
  editorialBlocks: z.array(editorialBlockSchema).optional(),
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
export type PropertyDetailsEditorialBlock = {
  id?: string;
  title: string;
  body: string;
  image?: string;
  imageAlt?: string;
};

export type PropertyDetailsSchema = Omit<
  PropertySchema,
  "template" | "gallery" | "editorialBlocks"
> & {
  gallery?: string[];
  editorialBlocks?: PropertyDetailsEditorialBlock[];
};
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
