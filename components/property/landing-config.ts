import { z } from "zod";

export const blockKeys = [
  "hero",
  "description",
  "editorial",
  "gallery",
  "services",
  "position",
  "contact",
  "faq",
  "footer",
] as const;

export type BlockKey = (typeof blockKeys)[number];

export type HeroCopy = {
  eyebrow?: string;
  outline?: string;
  subtitle?: string;
  supportingText?: string;
  primaryCta?: string;
  secondaryCta?: string;
};

export type GalleryCopy = {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
};

export type EditorialCopy = {
  title?: string;
  subtitle?: string;
};

export type ServicesCopy = {
  title?: string;
  subtitle?: string;
  emptyText?: string;
};

export type PositionCopy = {
  title?: string;
  subtitle?: string;
  emptyText?: string;
};

export type ContactCopy = {
  title?: string;
  subtitle?: string;
  formTitle?: string;
  formSubtitle?: string;
  emptyFormHint?: string;
};

export type FaqCopy = {
  title?: string;
  subtitle?: string;
  emptyText?: string;
};

export type FooterCopy = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  stickyLabel?: string;
  stickyHelper?: string;
};

export type LandingCopy = {
  hero?: HeroCopy;
  editorial?: EditorialCopy;
  gallery?: GalleryCopy;
  services?: ServicesCopy;
  position?: PositionCopy;
  contact?: ContactCopy;
  faq?: FaqCopy;
  footer?: FooterCopy;
};

export type LandingLayout = {
  order?: BlockKey[];
  hidden?: BlockKey[];
};

export type ResolvedLandingCopy = {
  hero: HeroCopy;
  editorial: EditorialCopy;
  gallery: GalleryCopy;
  services: ServicesCopy;
  position: PositionCopy;
  contact: ContactCopy;
  faq: FaqCopy;
  footer: FooterCopy;
};

export type ResolvedLandingLayout = {
  order: BlockKey[];
  hidden: BlockKey[];
};

export const defaultBlockOrder: BlockKey[] = [
  "hero",
  "description",
  "editorial",
  "gallery",
  "services",
  "position",
  "contact",
  "faq",
  "footer",
];

const createEmptyLandingCopy = (): ResolvedLandingCopy => ({
  hero: {},
  editorial: {},
  gallery: {},
  services: {},
  position: {},
  contact: {},
  faq: {},
  footer: {},
});

const createDefaultLandingLayout = (): ResolvedLandingLayout => ({
  order: defaultBlockOrder,
  hidden: [],
});

export type LandingConfig = {
  copy?: LandingCopy;
  layout?: LandingLayout;
};

export type ResolvedLandingConfig = {
  copy: ResolvedLandingCopy;
  layout: ResolvedLandingLayout;
};

const heroCopySchema = z.object({
  eyebrow: z.string().optional(),
  outline: z.string().optional(),
  subtitle: z.string().optional(),
  supportingText: z.string().optional(),
  primaryCta: z.string().optional(),
  secondaryCta: z.string().optional(),
});

const galleryCopySchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  buttonLabel: z.string().optional(),
});

const editorialCopySchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
});

const servicesCopySchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  emptyText: z.string().optional(),
});

const positionCopySchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  emptyText: z.string().optional(),
});

const contactCopySchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  formTitle: z.string().optional(),
  formSubtitle: z.string().optional(),
  emptyFormHint: z.string().optional(),
});

const faqCopySchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  emptyText: z.string().optional(),
});

const footerCopySchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  ctaLabel: z.string().optional(),
  stickyLabel: z.string().optional(),
  stickyHelper: z.string().optional(),
});

const layoutSchema = z.object({
  order: z.array(z.enum(blockKeys)).optional(),
  hidden: z.array(z.enum(blockKeys)).optional(),
});

export const landingSchema = z
  .object({
    copy: z
      .object({
        hero: heroCopySchema.optional(),
        editorial: editorialCopySchema.optional(),
        gallery: galleryCopySchema.optional(),
        services: servicesCopySchema.optional(),
        position: positionCopySchema.optional(),
        contact: contactCopySchema.optional(),
        faq: faqCopySchema.optional(),
        footer: footerCopySchema.optional(),
      })
      .default({}),
    layout: layoutSchema.optional(),
  })
  .default({
    copy: {},
    layout: {},
  });

export const getDefaultLandingConfig = (): ResolvedLandingConfig => ({
  copy: createEmptyLandingCopy(),
  layout: createDefaultLandingLayout(),
});

const normalizeCopyValue = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const sanitizeHeroCopy = (copy?: HeroCopy): HeroCopy => ({
  eyebrow: normalizeCopyValue(copy?.eyebrow),
  outline: normalizeCopyValue(copy?.outline),
  subtitle: normalizeCopyValue(copy?.subtitle),
  supportingText: normalizeCopyValue(copy?.supportingText),
  primaryCta: normalizeCopyValue(copy?.primaryCta),
  secondaryCta: normalizeCopyValue(copy?.secondaryCta),
});

const sanitizeGalleryCopy = (copy?: GalleryCopy): GalleryCopy => ({
  title: normalizeCopyValue(copy?.title),
  subtitle: normalizeCopyValue(copy?.subtitle),
  buttonLabel: normalizeCopyValue(copy?.buttonLabel),
});

const sanitizeEditorialCopy = (copy?: EditorialCopy): EditorialCopy => ({
  title: normalizeCopyValue(copy?.title),
  subtitle: normalizeCopyValue(copy?.subtitle),
});

const sanitizeServicesCopy = (copy?: ServicesCopy): ServicesCopy => ({
  title: normalizeCopyValue(copy?.title),
  subtitle: normalizeCopyValue(copy?.subtitle),
  emptyText: normalizeCopyValue(copy?.emptyText),
});

const sanitizePositionCopy = (copy?: PositionCopy): PositionCopy => ({
  title: normalizeCopyValue(copy?.title),
  subtitle: normalizeCopyValue(copy?.subtitle),
  emptyText: normalizeCopyValue(copy?.emptyText),
});

const sanitizeContactCopy = (copy?: ContactCopy): ContactCopy => ({
  title: normalizeCopyValue(copy?.title),
  subtitle: normalizeCopyValue(copy?.subtitle),
  formTitle: normalizeCopyValue(copy?.formTitle),
  formSubtitle: normalizeCopyValue(copy?.formSubtitle),
  emptyFormHint: normalizeCopyValue(copy?.emptyFormHint),
});

const sanitizeFaqCopy = (copy?: FaqCopy): FaqCopy => ({
  title: normalizeCopyValue(copy?.title),
  subtitle: normalizeCopyValue(copy?.subtitle),
  emptyText: normalizeCopyValue(copy?.emptyText),
});

const sanitizeFooterCopy = (copy?: FooterCopy): FooterCopy => ({
  title: normalizeCopyValue(copy?.title),
  subtitle: normalizeCopyValue(copy?.subtitle),
  ctaLabel: normalizeCopyValue(copy?.ctaLabel),
  stickyLabel: normalizeCopyValue(copy?.stickyLabel),
  stickyHelper: normalizeCopyValue(copy?.stickyHelper),
});

const normalizeBlockOrder = (order?: BlockKey[]): BlockKey[] => {
  const unique = Array.from(new Set(order ?? []));
  const filtered = unique.filter((key) => blockKeys.includes(key));
  const base = filtered.length > 0 ? filtered : defaultBlockOrder;
  const missing = defaultBlockOrder.filter((key) => !base.includes(key));
  return [...base, ...missing];
};

const normalizeHiddenBlocks = (hidden?: BlockKey[]): BlockKey[] => {
  const unique = Array.from(new Set(hidden ?? []));
  return unique.filter((key) => blockKeys.includes(key));
};

const sanitizeLandingLayout = (
  layout?: LandingLayout
): ResolvedLandingLayout => ({
  order: normalizeBlockOrder(layout?.order),
  hidden: normalizeHiddenBlocks(layout?.hidden),
});

export const resolveLandingConfig = (
  config?: Partial<LandingConfig> | null
): ResolvedLandingConfig => {
  const copyInput = config?.copy ?? {};
  const layoutInput = config?.layout ?? {};

  return {
    copy: {
      hero: sanitizeHeroCopy(copyInput.hero),
      editorial: sanitizeEditorialCopy(copyInput.editorial),
      gallery: sanitizeGalleryCopy(copyInput.gallery),
      services: sanitizeServicesCopy(copyInput.services),
      position: sanitizePositionCopy(copyInput.position),
      contact: sanitizeContactCopy(copyInput.contact),
      faq: sanitizeFaqCopy(copyInput.faq),
      footer: sanitizeFooterCopy(copyInput.footer),
    },
    layout: sanitizeLandingLayout(layoutInput),
  };
};
