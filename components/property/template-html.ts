import { services } from "@/components/property/services";
import type { PropertyFormValues } from "@/components/property/schema";
import {
  blockKeys,
  defaultBlockOrder,
  type BlockKey,
  type LandingCopy,
} from "@/components/property/landing-config";

export type TemplatePalette = {
  id: string;
  label: string;
  colors: {
    ink: string;
    muted: string;
    accent: string;
    accentStrong: string;
    bg: string;
    card: string;
  };
};

export type TemplateFont = {
  id: string;
  label: string;
  stack: string;
  googleFamily: string;
};

export type TemplateTheme = {
  palette: string;
  fontTitle: string;
  fontBody: string;
  galleryLayout: "grid" | "mosaic" | "masonry";
};

export const templateGalleryLayouts = [
  { id: "grid", label: "Griglia uniforme" },
  { id: "mosaic", label: "Mosaic" },
  { id: "masonry", label: "Masonry" },
] as const;

export const templatePalettes: TemplatePalette[] = [
  {
    id: "sabbia",
    label: "Sabbia",
    colors: {
      ink: "#2f2a24",
      muted: "#6f665c",
      accent: "#d59a62",
      accentStrong: "#b9773f",
      bg: "#f8f2e9",
      card: "#ffffff",
    },
  },
  {
    id: "salvia",
    label: "Salvia",
    colors: {
      ink: "#22312d",
      muted: "#5c6f66",
      accent: "#7aa389",
      accentStrong: "#5f8a6f",
      bg: "#eef4f1",
      card: "#ffffff",
    },
  },
  {
    id: "mare",
    label: "Mare",
    colors: {
      ink: "#1a2f3b",
      muted: "#5a6f7c",
      accent: "#4aa3b3",
      accentStrong: "#2f7f93",
      bg: "#eef6f7",
      card: "#ffffff",
    },
  },
  {
    id: "tramonto",
    label: "Tramonto",
    colors: {
      ink: "#3b1e1e",
      muted: "#7a5656",
      accent: "#de6f4c",
      accentStrong: "#bf4f2e",
      bg: "#f9efe9",
      card: "#ffffff",
    },
  },
  {
    id: "notte",
    label: "Notte",
    colors: {
      ink: "#f1f1f1",
      muted: "#b0b6c0",
      accent: "#9a8cff",
      accentStrong: "#7b6ee8",
      bg: "#12161f",
      card: "#1b2230",
    },
  },
  {
    id: "terra",
    label: "Terra",
    colors: {
      ink: "#2c231a",
      muted: "#6d5f51",
      accent: "#c98b5c",
      accentStrong: "#a66a3e",
      bg: "#f5ede4",
      card: "#fffaf5",
    },
  },
  {
    id: "aurora",
    label: "Aurora",
    colors: {
      ink: "#1f2a33",
      muted: "#5b6b75",
      accent: "#7cc5d5",
      accentStrong: "#4ea6b9",
      bg: "#eef5f7",
      card: "#ffffff",
    },
  },
  {
    id: "lavanda",
    label: "Lavanda",
    colors: {
      ink: "#2b2235",
      muted: "#6b5f78",
      accent: "#c39be6",
      accentStrong: "#a979d2",
      bg: "#f4eff9",
      card: "#ffffff",
    },
  },
  {
    id: "oliva",
    label: "Oliva",
    colors: {
      ink: "#2b2a1f",
      muted: "#6a6859",
      accent: "#a3b36a",
      accentStrong: "#86984e",
      bg: "#f3f4ea",
      card: "#ffffff",
    },
  },
  {
    id: "corallo",
    label: "Corallo",
    colors: {
      ink: "#3a2020",
      muted: "#7c5a57",
      accent: "#ff8a6a",
      accentStrong: "#e06a4e",
      bg: "#fff1ec",
      card: "#ffffff",
    },
  },
  {
    id: "petrolio",
    label: "Petrolio",
    colors: {
      ink: "#eef2f2",
      muted: "#b2c0c3",
      accent: "#4fd1c5",
      accentStrong: "#2fb3a7",
      bg: "#0f1c1f",
      card: "#18272b",
    },
  },
  {
    id: "grafite",
    label: "Grafite",
    colors: {
      ink: "#f2f3f4",
      muted: "#c1c6cc",
      accent: "#9aa7ff",
      accentStrong: "#7b89f0",
      bg: "#101317",
      card: "#1a2027",
    },
  },
];

export const templateFonts: TemplateFont[] = [
  {
    id: "playfair",
    label: "Playfair Display",
    stack: '"Playfair Display", "Georgia", serif',
    googleFamily: "Playfair+Display:wght@400;600;700",
  },
  {
    id: "lora",
    label: "Lora",
    stack: '"Lora", "Georgia", serif',
    googleFamily: "Lora:wght@400;600;700",
  },
  {
    id: "merriweather",
    label: "Merriweather",
    stack: '"Merriweather", "Georgia", serif',
    googleFamily: "Merriweather:wght@400;700",
  },
  {
    id: "montserrat",
    label: "Montserrat",
    stack: '"Montserrat", "Helvetica Neue", sans-serif',
    googleFamily: "Montserrat:wght@400;500;600;700",
  },
  {
    id: "poppins",
    label: "Poppins",
    stack: '"Poppins", "Helvetica Neue", sans-serif',
    googleFamily: "Poppins:wght@400;500;600;700",
  },
  {
    id: "inter",
    label: "Inter",
    stack: '"Inter", "Helvetica Neue", sans-serif',
    googleFamily: "Inter:wght@400;500;600;700",
  },
  {
    id: "dm-serif",
    label: "DM Serif Display",
    stack: '"DM Serif Display", "Georgia", serif',
    googleFamily: "DM+Serif+Display:wght@400",
  },
  {
    id: "cormorant",
    label: "Cormorant Garamond",
    stack: '"Cormorant Garamond", "Georgia", serif',
    googleFamily: "Cormorant+Garamond:wght@400;600;700",
  },
  {
    id: "libre-baskerville",
    label: "Libre Baskerville",
    stack: '"Libre Baskerville", "Georgia", serif',
    googleFamily: "Libre+Baskerville:wght@400;700",
  },
  {
    id: "manrope",
    label: "Manrope",
    stack: '"Manrope", "Helvetica Neue", sans-serif',
    googleFamily: "Manrope:wght@400;500;600;700",
  },
  {
    id: "work-sans",
    label: "Work Sans",
    stack: '"Work Sans", "Helvetica Neue", sans-serif',
    googleFamily: "Work+Sans:wght@400;500;600;700",
  },
  {
    id: "space-grotesk",
    label: "Space Grotesk",
    stack: '"Space Grotesk", "Helvetica Neue", sans-serif',
    googleFamily: "Space+Grotesk:wght@400;500;600;700",
  },
];

export const defaultTemplateTheme: TemplateTheme = {
  palette: "sabbia",
  fontTitle: "playfair",
  fontBody: "inter",
  galleryLayout: "grid",
};

type GalleryItem = {
  url: string;
  alt: string;
};

type EditorialBlock = {
  title: string;
  body: string;
  image?: string;
  imageAlt?: string;
};

type TemplateInput = {
  propertyId?: string;
  info?: PropertyFormValues["info"];
  services?: string[];
  gallery?: GalleryItem[];
  position?: PropertyFormValues["position"];
  contact?: PropertyFormValues["contact"];
  booking?: PropertyFormValues["booking"];
  editorialBlocks?: EditorialBlock[];
  faqs?: PropertyFormValues["faqs"];
  landingCopy?: LandingCopy;
  landing?: PropertyFormValues["landing"];
  theme?: TemplateTheme;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const normalizeHex = (value: string) => {
  const raw = value.replace("#", "").trim();
  if (raw.length === 3) {
    return raw
      .split("")
      .map((char) => `${char}${char}`)
      .join("");
  }
  if (raw.length >= 6) {
    return raw.slice(0, 6);
  }
  return "000000";
};

const hexToRgb = (value: string) => {
  const hex = normalizeHex(value);
  const num = Number.parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
};

const hexToRgba = (value: string, alpha: number) => {
  const { r, g, b } = hexToRgb(value);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getRelativeLuminance = (value: string) => {
  const { r, g, b } = hexToRgb(value);
  const toLinear = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };
  const rLin = toLinear(r);
  const gLin = toLinear(g);
  const bLin = toLinear(b);
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
};

const isDarkColor = (value: string) => getRelativeLuminance(value) < 0.5;

const getContrastColor = (value: string) =>
  isDarkColor(value) ? "#fefcf8" : "#1b1208";

type SvgElement = {
  type?: string;
  props?: Record<string, unknown>;
};

const svgAttributeMap: Record<string, string> = {
  className: "class",
  strokeWidth: "stroke-width",
  strokeLinecap: "stroke-linecap",
  strokeLinejoin: "stroke-linejoin",
};

const renderSvgNode = (node: unknown): string => {
  if (node == null || typeof node === "boolean") return "";
  if (Array.isArray(node)) {
    return node.map((item) => renderSvgNode(item)).join("");
  }
  if (typeof node === "string" || typeof node === "number") {
    return escapeHtml(String(node));
  }
  const element = node as SvgElement;
  if (!element.type || typeof element.type !== "string") return "";
  const props = element.props ?? {};
  const attrs = Object.entries(props)
    .filter(
      ([key, value]) => value != null && key !== "children" && key !== "ref"
    )
    .map(([key, value]) => {
      const attrName = svgAttributeMap[key] ?? key;
      return `${attrName}="${escapeHtml(String(value))}"`;
    })
    .join(" ");
  const children = renderSvgNode(props.children);
  return `<${element.type}${attrs ? ` ${attrs}` : ""}>${children}</${
    element.type
  }>`;
};

const buildLucideSvg = (icon: unknown, className: string) => {
  const iconType = (icon as { type?: { render?: Function } })?.type;
  const renderIcon = iconType?.render;
  if (typeof renderIcon !== "function") return "";
  const iconElement = renderIcon(
    { color: "currentColor", size: 24, className },
    null
  );
  const baseType = (iconElement as { type?: { render?: Function } })?.type;
  const baseRender = baseType?.render;
  const svgElement =
    typeof baseRender === "function"
      ? baseRender(
          (iconElement as { props?: Record<string, unknown> }).props,
          null
        )
      : iconElement;
  return renderSvgNode(svgElement);
};

const formatText = (value: string) =>
  escapeHtml(value).replace(/\r?\n/g, "<br />");

const formatServiceLabel = (value: string) => {
  const normalized = value.replace(/[-_]+/g, " ").trim();
  return normalized ? normalized : value;
};

const normalizeCopy = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const normalizeUrl = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const toCssUrl = (value: string) =>
  encodeURI(value).replace(/'/g, "%27").replace(/\)/g, "%29");

const resolvePalette = (id?: string) =>
  templatePalettes.find((palette) => palette.id === id) ?? templatePalettes[0];

const resolveFont = (id?: string) =>
  templateFonts.find((font) => font.id === id) ?? templateFonts[0];

const resolveGalleryLayout = (value?: string) =>
  templateGalleryLayouts.some((layout) => layout.id === value)
    ? (value as TemplateTheme["galleryLayout"])
    : defaultTemplateTheme.galleryLayout;

const normalizeBlockOrder = (order?: BlockKey[]) => {
  const unique = Array.from(new Set(order ?? []));
  const filtered = unique.filter((key) => blockKeys.includes(key));
  const base = filtered.length > 0 ? filtered : defaultBlockOrder;
  const missing = defaultBlockOrder.filter((key) => !base.includes(key));
  return [...base, ...missing];
};

const normalizeHiddenBlocks = (hidden?: BlockKey[]) => {
  const unique = Array.from(new Set(hidden ?? []));
  return unique.filter((key) => blockKeys.includes(key));
};

const buildGoogleFontUrl = (fonts: TemplateFont[]) => {
  const unique = new Map(fonts.map((font) => [font.id, font]));
  const families = Array.from(unique.values()).map(
    (font) => `family=${font.googleFamily}`
  );
  return families.length > 0
    ? `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`
    : null;
};

export const extractTemplateTheme = (html: string): TemplateTheme => {
  const paletteMatch = html.match(/data-template-palette="([^"]+)"/i);
  const titleMatch = html.match(/data-template-font-title="([^"]+)"/i);
  const bodyMatch = html.match(/data-template-font-body="([^"]+)"/i);
  const galleryMatch = html.match(/data-template-gallery="([^"]+)"/i);

  return {
    palette: paletteMatch?.[1] ?? defaultTemplateTheme.palette,
    fontTitle: titleMatch?.[1] ?? defaultTemplateTheme.fontTitle,
    fontBody: bodyMatch?.[1] ?? defaultTemplateTheme.fontBody,
    galleryLayout: resolveGalleryLayout(galleryMatch?.[1]),
  };
};

export const buildPropertyLandingHtml = ({
  propertyId,
  info,
  services: serviceIds,
  gallery,
  position,
  contact,
  booking,
  editorialBlocks,
  faqs,
  landingCopy: landingCopyInput,
  landing,
  theme,
}: TemplateInput): string => {
  const resolvedTheme = {
    palette: theme?.palette ?? defaultTemplateTheme.palette,
    fontTitle: theme?.fontTitle ?? defaultTemplateTheme.fontTitle,
    fontBody: theme?.fontBody ?? defaultTemplateTheme.fontBody,
    galleryLayout: resolveGalleryLayout(theme?.galleryLayout),
  };
  const propertyIdValue = propertyId?.trim() ?? "";
  const landingCopy = landing?.copy ?? landingCopyInput;
  const landingLayout = landing?.layout;
  const palette = resolvePalette(resolvedTheme.palette);
  const headingFont = resolveFont(resolvedTheme.fontTitle);
  const bodyFont = resolveFont(resolvedTheme.fontBody);
  const googleFontsUrl = buildGoogleFontUrl([headingFont, bodyFont]);
  const isDarkPalette = isDarkColor(palette.colors.bg);
  const templateMode = isDarkPalette ? "dark" : "light";
  const onAccent = getContrastColor(palette.colors.accent);
  const accentShadow = hexToRgba(
    palette.colors.accent,
    isDarkPalette ? 0.28 : 0.35
  );
  const lineColor = isDarkPalette
    ? "rgba(255, 255, 255, 0.16)"
    : "rgba(15, 20, 24, 0.12)";
  const lineSoft = isDarkPalette
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(15, 20, 24, 0.08)";
  const fieldBg = isDarkPalette ? "rgba(255, 255, 255, 0.06)" : "#ffffff";
  const fieldBorder = isDarkPalette
    ? "rgba(255, 255, 255, 0.2)"
    : "rgba(15, 20, 24, 0.12)";
  const cardMuted = isDarkPalette
    ? "rgba(255, 255, 255, 0.06)"
    : "rgba(255, 255, 255, 0.7)";
  const shadowSoft = isDarkPalette
    ? "0 12px 30px rgba(0, 0, 0, 0.45)"
    : "0 12px 30px rgba(15, 20, 24, 0.08)";
  const shadowMd = isDarkPalette
    ? "0 18px 35px rgba(0, 0, 0, 0.5)"
    : "0 18px 35px rgba(16, 20, 24, 0.12)";
  const shadowLg = isDarkPalette
    ? "0 22px 45px rgba(0, 0, 0, 0.6)"
    : "0 22px 45px rgba(16, 20, 24, 0.16)";
  const shadowXl = isDarkPalette
    ? "0 28px 60px rgba(0, 0, 0, 0.65)"
    : "0 28px 60px rgba(0, 0, 0, 0.25)";
  const shadowBase = isDarkPalette
    ? "0 20px 50px rgba(0, 0, 0, 0.5)"
    : "0 20px 50px rgba(14, 20, 24, 0.15)";
  const mapAccent = hexToRgba(
    palette.colors.accent,
    isDarkPalette ? 0.25 : 0.2
  );
  const mapAccentAlt = hexToRgba(
    palette.colors.accentStrong,
    isDarkPalette ? 0.2 : 0.15
  );
  const modalBg = isDarkPalette ? "#0b0f12" : "#ffffff";
  const modalInk = isDarkPalette ? "#f2f2f2" : "#f8f2e9";
  const modalFrame = isDarkPalette ? "#080b0e" : "#0b0f12";
  const footerBg = isDarkPalette ? "#1a2430" : "#1f2426";
  const footerInk = "#fefcf8";
  const footerNote = "rgba(255, 255, 255, 0.7)";

  const propertyName = info?.name?.trim() || "Nome proprieta";
  const description =
    info?.description?.trim() || "Descrizione non disponibile.";

  const heroImage = gallery?.[0]?.url ?? "";
  const heroImageStyle = heroImage
    ? ` style="--hero-image: url('${toCssUrl(heroImage)}')"`
    : "";

  const heroSubtitle = normalizeCopy(landingCopy?.hero?.subtitle);
  const heroSupporting = normalizeCopy(landingCopy?.hero?.supportingText);
  const heroPrimaryCta =
    normalizeCopy(landingCopy?.hero?.primaryCta) ?? "Prenota ora";
  const heroSecondaryCta =
    normalizeCopy(landingCopy?.hero?.secondaryCta) ?? "Contatta l'host";
  const heroOutline =
    normalizeCopy(landingCopy?.hero?.outline) ?? "Il tuo rifugio d'autore";
  const heroOutlineHtml = heroOutline
    ? `<p class="hero-outline">${escapeHtml(heroOutline)}</p>`
    : "";
  const bookingDirectUrl = normalizeUrl(booking?.bookingUrl);
  const bookingCtaHtml = bookingDirectUrl
    ? `<a class="btn btn-primary" href="${escapeHtml(
        bookingDirectUrl
      )}" target="_blank" rel="noopener noreferrer">${escapeHtml(
        heroPrimaryCta
      )}</a>`
    : "";
  const heroActionsHtml = `
    <div class="hero-actions">
      ${bookingCtaHtml}
      <a class="btn btn-outline" href="#contatti" data-scroll>${escapeHtml(
        heroSecondaryCta
      )}</a>
    </div>
  `;
  const heroContentHtml = `
    <h1>${escapeHtml(propertyName)}</h1>
    ${heroOutlineHtml}
    ${
      heroSubtitle
        ? `<p class="hero-subtitle">${escapeHtml(heroSubtitle)}</p>`
        : ""
    }
    ${
      heroSupporting
        ? `<p class="hero-subtitle">${escapeHtml(heroSupporting)}</p>`
        : ""
    }
    ${heroActionsHtml}
  `;

  const editorialTitle =
    normalizeCopy(landingCopy?.editorial?.title) ?? "Approfondimenti";
  const editorialSubtitle = normalizeCopy(landingCopy?.editorial?.subtitle);

  const galleryTitle = normalizeCopy(landingCopy?.gallery?.title) ?? "Galleria";
  const gallerySubtitle = normalizeCopy(landingCopy?.gallery?.subtitle);
  const galleryButton = normalizeCopy(landingCopy?.gallery?.buttonLabel);

  const servicesTitle =
    normalizeCopy(landingCopy?.services?.title) ?? "Servizi";
  const servicesSubtitle = normalizeCopy(landingCopy?.services?.subtitle);
  const servicesEmpty =
    normalizeCopy(landingCopy?.services?.emptyText) ??
    "Nessun servizio selezionato.";

  const positionTitle =
    normalizeCopy(landingCopy?.position?.title) ?? "Posizione";
  const positionSubtitle = normalizeCopy(landingCopy?.position?.subtitle);
  const positionEmpty =
    normalizeCopy(landingCopy?.position?.emptyText) ??
    "Posizione non specificata.";

  const contactTitle = normalizeCopy(landingCopy?.contact?.title) ?? "Contatti";
  const contactSubtitle = normalizeCopy(landingCopy?.contact?.subtitle);
  const contactName = normalizeCopy(contact?.name) ?? "Host";
  const contactEmail = normalizeCopy(contact?.email);
  const contactPhone = normalizeCopy(contact?.phone);
  const contactPhoneLink = contactPhone
    ? contactPhone.replace(/[^+\d]/g, "")
    : "";

  const faqTitle = normalizeCopy(landingCopy?.faq?.title) ?? "FAQ";
  const faqSubtitle = normalizeCopy(landingCopy?.faq?.subtitle);
  const faqEmpty =
    normalizeCopy(landingCopy?.faq?.emptyText) ??
    "Nessuna domanda disponibile.";

  const footerTitle =
    normalizeCopy(landingCopy?.footer?.title) ?? "Pronto a soggiornare?";
  const footerSubtitle =
    normalizeCopy(landingCopy?.footer?.subtitle) ??
    "Contattaci per disponibilita e dettagli personalizzati.";
  const footerCta =
    normalizeCopy(landingCopy?.footer?.ctaLabel) ?? "Richiedi info";
  const footerSecondary = normalizeCopy(landingCopy?.footer?.stickyLabel);
  const footerHelper = normalizeCopy(landingCopy?.footer?.stickyHelper);

  const resolvedServices =
    serviceIds?.map((id) => {
      const service = services.find((entry) => entry.id === id);
      return {
        label: service?.label ?? formatServiceLabel(id),
        iconSvg: service
          ? buildLucideSvg(service.icon, "service-icon-svg")
          : "",
      };
    }) ?? [];

  const galleryItems = gallery ?? [];
  const galleryPreviewItems = galleryItems.slice(0, 9);
  const hasGalleryOverflow = galleryItems.length > 9;
  const galleryHtml =
    galleryPreviewItems.length > 0
      ? galleryPreviewItems
          .map((item, index) => {
            const delay = index * 60;
            return `
              <button class="gallery-card" type="button" data-gallery-index="${index}" data-reveal style="--reveal-delay:${delay}ms">
                <img src="${escapeHtml(item.url)}" alt="${escapeHtml(
              item.alt
            )}" loading="lazy" />
              </button>`;
          })
          .join("")
      : `<p class="section-empty">${escapeHtml(
          "Nessuna immagine disponibile."
        )}</p>`;
  const galleryModalHtml = hasGalleryOverflow
    ? `
      <div class="gallery-modal" data-gallery-modal aria-hidden="true" role="dialog" aria-label="Galleria foto">
        <div class="gallery-modal-backdrop" data-gallery-close></div>
        <div class="gallery-modal-content" role="document">
          <button class="gallery-close" type="button" data-gallery-close aria-label="Chiudi">Chiudi</button>
          <div class="gallery-stage">
            <button class="gallery-arrow" type="button" data-gallery-prev aria-label="Foto precedente">&#8592;</button>
            <img class="gallery-modal-image" src="${escapeHtml(
              galleryItems[0]?.url ?? ""
            )}" alt="${escapeHtml(galleryItems[0]?.alt ?? "Foto")}" />
            <button class="gallery-arrow" type="button" data-gallery-next aria-label="Foto successiva">&#8594;</button>
          </div>
          <div class="gallery-thumbs">
            ${galleryItems
              .map(
                (item, index) => `
                  <button class="gallery-thumb" type="button" data-index="${index}" data-src="${escapeHtml(
                  item.url
                )}" data-alt="${escapeHtml(item.alt)}" aria-label="Foto ${
                  index + 1
                }">
                    <img src="${escapeHtml(item.url)}" alt="${escapeHtml(
                  item.alt
                )}" loading="lazy" />
                  </button>`
              )
              .join("")}
          </div>
        </div>
      </div>`
    : "";

  const locationLine = [position?.address]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(", ");
  const latitude =
    typeof position?.lat === "number" && Number.isFinite(position.lat)
      ? position.lat
      : null;
  const longitude =
    typeof position?.lng === "number" && Number.isFinite(position.lng)
      ? position.lng
      : null;
  const hasCoordinates = latitude !== null && longitude !== null;
  const formatCoord = (value: number) => value.toFixed(6);
  const mapEmbedUrl = hasCoordinates
    ? (() => {
        const delta = 0.005;
        const left = formatCoord(longitude - delta);
        const right = formatCoord(longitude + delta);
        const top = formatCoord(latitude + delta);
        const bottom = formatCoord(latitude - delta);
        return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${formatCoord(
          latitude
        )}%2C${formatCoord(longitude)}`;
      })()
    : "";
  const mapLinkUrl = hasCoordinates
    ? `https://www.openstreetmap.org/?mlat=${formatCoord(
        latitude
      )}&mlon=${formatCoord(longitude)}#map=15/${formatCoord(
        latitude
      )}/${formatCoord(longitude)}`
    : "";

  const faqItems = (faqs ?? []).filter(
    (item) => item?.question || item?.answer
  );


  const faqHtml =
    faqItems.length > 0
      ? faqItems
          .map((item, index) => {
            const question = item?.question?.trim() || "Domanda";
            const answer = item?.answer?.trim() || "Risposta";
            return `
              <details class="faq-item" data-reveal style="--reveal-delay:${
                index * 40
              }ms">
                <summary>${escapeHtml(question)}</summary>
                <div class="faq-answer">${formatText(answer)}</div>
              </details>`;
          })
          .join("")
      : "";

  const faqSectionHtml =
    faqItems.length > 0
      ? `
    <section id="faq">
      <div class="section-header" data-reveal>
        <h2>${escapeHtml(faqTitle)}</h2>
        ${faqSubtitle ? `<p>${escapeHtml(faqSubtitle)}</p>` : ""}
      </div>
      <div class="faq-list">
        ${faqHtml}
      </div>
    </section>
  `
      : "";

  const servicesHtml =
    resolvedServices.length > 0
      ? resolvedServices
          .map(
            ({ label, iconSvg }, index) => `
              <li class="service-card" data-reveal style="--reveal-delay:${
                index * 40
              }ms">
                ${iconSvg ? `<span class="service-icon">${iconSvg}</span>` : ""}
                <span>${escapeHtml(label)}</span>
              </li>`
          )
          .join("")
      : `<p class="section-empty">${escapeHtml(servicesEmpty)}</p>`;

  const descriptionStatsHtml = `
    <div class="description-stats">
      <div class="description-stat">
        <div class="stat-label">Camere</div>
        <div class="stat-value">${escapeHtml(String(info?.rooms ?? 0))}</div>
      </div>
      <div class="description-stat">
        <div class="stat-label">Bagni</div>
        <div class="stat-value">${escapeHtml(
          String(info?.bathrooms ?? 0)
        )}</div>
      </div>
      <div class="description-stat">
        <div class="stat-label">Ospiti</div>
        <div class="stat-value">${escapeHtml(String(info?.guests ?? 0))}</div>
      </div>
    </div>
  `;

  const descriptionSectionHtml = `
    <section id="descrizione">
      <div class="section-header" data-reveal>
        <h2>Descrizione</h2>
      </div>
      <div class="description-panel" data-reveal>
        ${descriptionStatsHtml}
        <p>${formatText(description)}</p>
      </div>
    </section>
  `;

  const editorialItems = (editorialBlocks ?? [])
    .map((block) => ({
      title: block.title?.trim() ?? "",
      body: block.body?.trim() ?? "",
      image: block.image?.trim() ?? "",
      imageAlt: block.imageAlt?.trim() ?? "",
    }))
    .filter((block) => block.title && block.body);
  const editorialBlocksHtml =
    editorialItems.length > 0
      ? editorialItems
          .map(
            (block, index) => `
              <article class="editorial-card" data-reveal style="--reveal-delay:${
                index * 40
              }ms">
                ${
                  block.image
                    ? `<div class="editorial-media">
                  <img src="${escapeHtml(block.image)}" alt="${escapeHtml(
                      block.imageAlt || block.title
                    )}" loading="lazy" />
                </div>`
                    : ""
                }
                <div class="editorial-content">
                  <h3>${escapeHtml(block.title)}</h3>
                  <p>${formatText(block.body)}</p>
                </div>
              </article>`
          )
          .join("")
      : "";
  const editorialSectionHtml =
    editorialItems.length > 0
      ? `
    <section id="editorial">
      <div class="section-header" data-reveal>
        <h2>${escapeHtml(editorialTitle)}</h2>
        ${editorialSubtitle ? `<p>${escapeHtml(editorialSubtitle)}</p>` : ""}
      </div>
      <div class="editorial-list">
        ${editorialBlocksHtml}
      </div>
    </section>
  `
      : "";

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const turnstileScript = turnstileSiteKey
    ? `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>`
    : "";

  const contactFormHtml = contactEmail
    ? `
        <form class="contact-form" data-contact-form data-contact-email="${escapeHtml(
          contactEmail
        )}">
          <input type="hidden" name="propertyId" value="${escapeHtml(
            propertyIdValue
          )}" />
          <input type="hidden" name="formStart" data-form-start />
          <input type="hidden" name="turnstileToken" data-turnstile-token />
          <label class="contact-hp" aria-hidden="true">
            <span>Company</span>
            <input type="text" name="company" tabindex="-1" autocomplete="off" />
          </label>
          <label>
            <span>Nome</span>
            <input type="text" name="name" placeholder="Il tuo nome" required />
          </label>
          <label>
            <span>Email</span>
            <input type="email" name="email" placeholder="La tua email" />
          </label>
          <label>
            <span>Telefono</span>
            <input type="tel" name="phone" placeholder="es. +39 333 1234567" />
          </label>
          <label>
            <span>Messaggio</span>
            <textarea name="message" rows="4" placeholder="Scrivi qui..." required></textarea>
          </label>
          ${
            turnstileSiteKey
              ? `<div class="contact-captcha" data-turnstile data-sitekey="${escapeHtml(
                  turnstileSiteKey
                )}"></div>`
              : ""
          }
          <p class="contact-warning" data-contact-warning></p>
          <button class="btn btn-primary" type="submit">Invia richiesta</button>
        </form>
      `
    : "";

  const contactPhoneHtml = contactPhone
    ? `
        <div class="contact-card">
          <span class="contact-label">Telefono</span>
          <strong>${escapeHtml(contactPhone)}</strong>
          ${
            contactName
              ? `<span class="contact-helper">Contatta ${escapeHtml(
                  contactName
                )}</span>`
              : ""
          }
          <a class="btn btn-outline" href="tel:${escapeHtml(
            contactPhoneLink || contactPhone
          )}">Chiama</a>
        </div>
      `
    : "";

  const contactSectionHtml =
    contactEmail || contactPhone
      ? `
    <section id="contatti">
      <div class="section-header" data-reveal>
        <h2>${escapeHtml(contactTitle)}</h2>
        ${contactSubtitle ? `<p>${escapeHtml(contactSubtitle)}</p>` : ""}
      </div>
      <div class="contact-panel" data-reveal>
        <div class="contact-grid${
          contactEmail && contactPhone ? " contact-grid--split" : ""
        }">
          ${contactFormHtml}
          ${contactPhoneHtml}
        </div>
      </div>
    </section>
  `
      : "";

  const heroHtml = `
    <header class="hero hero--blend"${heroImageStyle}>
      <div class="hero-content" data-reveal>
        ${heroContentHtml}
      </div>
    </header>
  `;

  const servicesSectionHtml = `
    <section id="servizi">
      <div class="section-header" data-reveal>
        <h2>${escapeHtml(servicesTitle)}</h2>
        ${servicesSubtitle ? `<p>${escapeHtml(servicesSubtitle)}</p>` : ""}
      </div>
      ${
        resolvedServices.length > 0
          ? `<ul class="services-grid">${servicesHtml}</ul>`
          : servicesHtml
      }
    </section>
  `;

  const gallerySectionHtml = `
    <section id="galleria">
      <div class="section-header" data-reveal>
        <h2>${escapeHtml(galleryTitle)}</h2>
        ${gallerySubtitle ? `<p>${escapeHtml(gallerySubtitle)}</p>` : ""}
      </div>
      <div class="gallery-grid gallery-grid--${escapeHtml(
        resolvedTheme.galleryLayout
      )}">
        ${galleryHtml}
      </div>
      ${
        hasGalleryOverflow
          ? `<div class="gallery-more">
        <button class="btn btn-primary" type="button" data-gallery-open>
          Mostra altre foto
        </button>
      </div>`
          : ""
      }
      ${
        galleryButton
          ? `<div style="margin-top: 20px;"><a class="btn btn-primary" href="#contatti" data-scroll>${escapeHtml(
              galleryButton
            )}</a></div>`
          : ""
      }
    </section>
  `;

  const positionSectionHtml = `
    <section id="posizione">
      <div class="section-header" data-reveal>
        <h2>${escapeHtml(positionTitle)}</h2>
        ${positionSubtitle ? `<p>${escapeHtml(positionSubtitle)}</p>` : ""}
      </div>
      <div class="position-panel" data-reveal>
        ${
          locationLine
            ? `<p>${escapeHtml(locationLine)}</p>`
            : `<p class="section-empty">${escapeHtml(positionEmpty)}</p>`
        }
        ${
          hasCoordinates
            ? `<div class="position-map">
          <iframe
            title="Mappa posizione"
            src="${mapEmbedUrl}"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <a class="position-map-link" href="${mapLinkUrl}" target="_blank" rel="noreferrer">
          Apri su OpenStreetMap
        </a>`
            : ""
        }
      </div>
    </section>
  `;

  const footerSectionHtml = `
    <footer id="footer">
      <div class="footer-card" data-reveal>
        <h3>${escapeHtml(footerTitle)}</h3>
        <p>${escapeHtml(footerSubtitle)}</p>
        <div class="footer-actions">
          <a class="btn btn-primary" href="#contatti" data-scroll>${escapeHtml(
            footerCta
          )}</a>
          ${
            footerSecondary
              ? `<a class="btn btn-outline" href="#servizi" data-scroll>${escapeHtml(
                  footerSecondary
                )}</a>`
              : ""
          }
        </div>
        ${
          footerHelper
            ? `<p class="footer-note">${escapeHtml(footerHelper)}</p>`
            : ""
        }
      </div>
    </footer>
  `;

  const sectionsByKey: Record<BlockKey, string> = {
    hero: heroHtml,
    description: descriptionSectionHtml,
    editorial: editorialSectionHtml,
    gallery: gallerySectionHtml,
    services: servicesSectionHtml,
    position: positionSectionHtml,
    contact: contactSectionHtml,
    faq: faqSectionHtml,
    footer: footerSectionHtml,
  };
  const hiddenBlocks = new Set(normalizeHiddenBlocks(landingLayout?.hidden));
  const orderedSectionsHtml = normalizeBlockOrder(landingLayout?.order)
    .filter((key) => !hiddenBlocks.has(key))
    .map((key) => sectionsByKey[key] ?? "")
    .filter((section) => section.trim().length > 0)
    .join("");

  return `<!doctype html>
<html lang="it" data-template-mode="${templateMode}" data-template-palette="${escapeHtml(
    palette.id
  )}" data-template-font-title="${escapeHtml(
    headingFont.id
  )}" data-template-font-body="${escapeHtml(
    bodyFont.id
  )}" data-template-gallery="${escapeHtml(resolvedTheme.galleryLayout)}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(propertyName)}</title>
    ${
      googleFontsUrl
        ? `<link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="${googleFontsUrl}" rel="stylesheet" />`
        : ""
    }
    ${turnstileScript}
    <style>
      :root {
        --ink: ${palette.colors.ink};
        --muted: ${palette.colors.muted};
        --accent: ${palette.colors.accent};
        --accent-strong: ${palette.colors.accentStrong};
        --bg: ${palette.colors.bg};
        --card: ${palette.colors.card};
        --on-accent: ${onAccent};
        --accent-shadow: ${accentShadow};
        --line: ${lineColor};
        --line-soft: ${lineSoft};
        --field-bg: ${fieldBg};
        --field-border: ${fieldBorder};
        --card-muted: ${cardMuted};
        --shadow-soft: ${shadowSoft};
        --shadow-md: ${shadowMd};
        --shadow-lg: ${shadowLg};
        --shadow-xl: ${shadowXl};
        --shadow: ${shadowBase};
        --map-accent: ${mapAccent};
        --map-accent-alt: ${mapAccentAlt};
        --modal-bg: ${modalBg};
        --modal-ink: ${modalInk};
        --modal-frame: ${modalFrame};
        --footer-bg: ${footerBg};
        --footer-ink: ${footerInk};
        --footer-note: ${footerNote};
        --radius-lg: 24px;
        --radius-md: 16px;
        --radius-sm: 10px;
        --font-heading: ${headingFont.stack};
        --font-body: ${bodyFont.stack};
        color-scheme: ${templateMode};
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: var(--font-body);
        color: var(--ink);
        background: var(--bg);
        line-height: 1.6;
        scroll-behavior: smooth;
      }

      .preview-banner {
        position: sticky;
        top: 0;
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 20px;
        font-size: 0.85rem;
        font-weight: 600;
        text-align: center;
        background: var(--card);
        color: var(--ink);
        border-bottom: 1px solid var(--line);
      }

      img {
        max-width: 100%;
        display: block;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      .hero {
        min-height: 100vh;
        padding: clamp(48px, 8vw, 120px);
        display: flex;
        align-items: center;
        position: relative;
        background: var(--bg);
        color: var(--ink);
        overflow: hidden;
      }

      .hero--blend {
        align-items: center;
        color: #fefcf8;
        background:
          radial-gradient(circle at top, rgba(255, 255, 255, 0.8), rgba(248, 242, 233, 0.2)),
          linear-gradient(135deg, rgba(13, 18, 20, 0.78), rgba(13, 18, 20, 0.2)),
          var(--hero-image, linear-gradient(120deg, #f0d9b5, #c9c1b3));
        background-size: cover;
        background-position: center;
      }

      .hero-content {
        max-width: 860px;
        color: inherit;
        padding: 0;
        margin: 0 auto;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        position: relative;
        z-index: 2;
      }

      .hero--blend::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 1;
      }

      .hero--blend::after {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.7));
      }

      .hero-outline {
        margin: -4px 0 6px;
        font-family: var(--font-heading);
        font-size: clamp(1rem, 2vw, 1.4rem);
        font-style: italic;
        letter-spacing: 0.08em;
        color: rgba(255, 255, 255, 0.78);
      }

      .hero-eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.35em;
        font-size: 0.7rem;
        color: var(--muted);
        margin-bottom: 12px;
      }

      .hero--blend .hero-eyebrow {
        color: rgba(254, 252, 248, 0.7);
      }

      h1 {
        font-family: var(--font-heading);
        font-size: clamp(3rem, 6vw, 4.8rem);
        line-height: 1.05;
        margin: 0 0 12px;
      }

      .hero--blend h1 {
        text-shadow: 0 18px 40px rgba(8, 10, 12, 0.6);
      }

      .hero-subtitle {
        font-size: 1.15rem;
        color: var(--muted);
        margin-bottom: 12px;
      }

      .hero--blend .hero-subtitle {
        color: rgba(254, 252, 248, 0.8);
      }

      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        justify-content: center;
      }

      .hero--blend .hero-actions {
        margin-top: 6px;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 12px 22px;
        border-radius: 999px;
        font-weight: 600;
        border: 1px solid transparent;
        transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
      }

      .btn-primary {
        background: var(--accent);
        color: var(--on-accent);
        box-shadow: 0 12px 25px var(--accent-shadow);
      }

      .btn-primary:hover {
        background: var(--accent-strong);
      }

      .btn-outline {
        border-color: rgba(255, 255, 255, 0.5);
        color: #fefcf8;
        background: transparent;
      }

      .contact-card .btn-outline {
        border-color: var(--line);
        color: var(--ink);
        background: var(--card-muted);
      }

      .btn:hover {
        transform: translateY(-2px);
      }

      section {
        padding: clamp(48px, 8vw, 96px) clamp(24px, 8vw, 120px);
      }

      .section-header {
        margin-bottom: 28px;
      }

      .section-header h2 {
        font-family: var(--font-heading);
        font-size: clamp(1.8rem, 3vw, 2.4rem);
        margin: 0 0 8px;
      }

      .section-header p {
        margin: 0;
        color: var(--muted);
      }

      .section-empty {
        color: var(--muted);
        font-size: 0.95rem;
      }

      .editorial-list {
        display: grid;
        gap: 18px;
      }

      .editorial-card {
        display: grid;
        gap: 16px;
        grid-template-columns: minmax(0, 180px) minmax(0, 1fr);
        align-items: center;
        background: var(--card);
        border-radius: var(--radius-md);
        padding: 18px;
        box-shadow: var(--shadow-soft);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .editorial-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
      }

      .editorial-media {
        width: 100%;
        aspect-ratio: 4 / 3;
        border-radius: 16px;
        overflow: hidden;
        background: color-mix(in srgb, var(--card) 70%, var(--bg));
      }

      .editorial-media img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .editorial-content h3 {
        margin: 0 0 8px;
        font-family: var(--font-heading);
        font-size: 1.2rem;
      }

      .editorial-content p {
        margin: 0;
        color: var(--muted);
      }

      .services-grid {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .service-card {
        list-style: none;
        background: var(--card);
        border-radius: var(--radius-md);
        padding: 18px 16px;
        box-shadow: var(--shadow-soft);
        font-weight: 600;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .service-icon {
        color: var(--accent-strong);
      }

      .service-icon-svg {
        width: 30px;
        height: 30px;
      }

      .service-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
      }

      .gallery-grid {
        display: grid;
        gap: 18px;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }

      .gallery-grid--mosaic {
        grid-template-columns: repeat(4, minmax(0, 1fr));
        grid-auto-rows: 140px;
      }

      .gallery-grid--mosaic .gallery-card:first-child {
        grid-column: span 2;
        grid-row: span 2;
      }

      .gallery-grid--mosaic .gallery-card img {
        height: 100%;
        aspect-ratio: auto;
      }

      .gallery-grid--masonry {
        display: block;
        column-count: 3;
        column-gap: 18px;
      }

      .gallery-grid--masonry .gallery-card {
        display: inline-block;
        width: 100%;
        margin: 0 0 18px;
        break-inside: avoid;
      }

      .gallery-grid--masonry .gallery-card img {
        height: auto;
        aspect-ratio: auto;
        object-fit: contain;
      }

      .gallery-card {
        border-radius: var(--radius-md);
        overflow: hidden;
        box-shadow: var(--shadow-md);
        background: var(--card);
        border: none;
        padding: 0;
        text-align: left;
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .gallery-card img {
        width: 100%;
        aspect-ratio: 4 / 3;
        object-fit: cover;
        transition: transform 0.5s ease;
      }

      .gallery-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
      }

      .gallery-card:hover img {
        transform: scale(1.04);
      }

      .gallery-more {
        margin-top: 20px;
        display: flex;
        justify-content: center;
      }

      .gallery-more .btn {
        padding: 14px 34px;
        font-size: 1rem;
      }

      .gallery-modal {
        position: fixed;
        inset: 0;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 999;
      }

      .gallery-modal.is-open {
        display: flex;
      }

      .gallery-modal-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(10, 10, 12, 0.7);
      }

      .gallery-modal-content {
        position: relative;
        z-index: 2;
        width: min(1200px, 96vw);
        height: min(92vh, 980px);
        background: var(--modal-bg);
        color: var(--modal-ink);
        border-radius: 18px;
        display: flex;
        flex-direction: column;
        padding: 18px;
        gap: 14px;
      }

      .gallery-close {
        align-self: flex-end;
        border: 1px solid rgba(255, 255, 255, 0.3);
        background: transparent;
        color: inherit;
        padding: 8px 14px;
        border-radius: 999px;
        font-size: 0.85rem;
        cursor: pointer;
      }

      .gallery-stage {
        position: relative;
        flex: 1;
        min-height: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px 48px;
      }

      .gallery-modal-image {
        max-height: 100%;
        max-width: 100%;
        width: auto;
        object-fit: contain;
        border-radius: 12px;
        background: var(--modal-frame);
      }

      .gallery-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 46px;
        height: 46px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.06);
        color: inherit;
        font-size: 1.2rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .gallery-arrow[data-gallery-prev] {
        left: 8px;
      }

      .gallery-arrow[data-gallery-next] {
        right: 8px;
      }

      .gallery-arrow:disabled {
        opacity: 0.35;
        cursor: default;
      }

      .gallery-thumbs {
        display: flex;
        gap: 10px;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 6px 2px 10px;
        min-height: 74px;
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.35) transparent;
      }

      .gallery-thumb {
        border: 2px solid transparent;
        padding: 0;
        border-radius: 10px;
        overflow: hidden;
        background: transparent;
        cursor: pointer;
        flex: 0 0 auto;
        width: 86px;
      }

      .gallery-thumb img {
        width: 100%;
        height: 64px;
        object-fit: cover;
        display: block;
      }

      .gallery-thumb.is-active {
        border-color: var(--accent);
      }

      .contact-warning {
        display: none;
        margin: 0;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(255, 99, 71, 0.12);
        border: 1px solid rgba(255, 99, 71, 0.28);
        color: #f7c2b1;
      }

      .contact-warning.is-visible {
        display: block;
      }

      .contact-warning.is-success {
        background: rgba(34, 197, 94, 0.12);
        border-color: rgba(34, 197, 94, 0.35);
        color: #22c55e;
      }

      @media (max-width: 900px) {
        .hero--blend {
          align-items: center;
        }

        .gallery-grid--mosaic {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          grid-auto-rows: 160px;
        }

        .gallery-grid--masonry {
          column-count: 2;
        }

        .editorial-card {
          grid-template-columns: 1fr;
        }

        .gallery-modal-content {
          height: 96vh;
          padding: 14px;
        }

        .gallery-stage {
          padding: 6px 36px;
        }

        .gallery-arrow {
          width: 40px;
          height: 40px;
          font-size: 1rem;
        }
      }

      @media (max-width: 600px) {
        #servizi {
          padding: 40px 18px;
        }

        .services-grid {
          gap: 12px;
          grid-template-columns: 1fr;
        }

        .service-card {
          padding: 14px 12px;
        }

        #contatti {
          padding: 40px 18px;
        }

        .contact-grid,
        .contact-grid--split {
          grid-template-columns: 1fr !important;
        }

        .contact-panel {
          padding: 20px 16px;
        }

        .contact-card {
          width: 100%;
        }

        .contact-form .btn {
          width: 100%;
          justify-content: center;
        }

        h1 {
          line-height: 1.02;
        }

        .section-header h2 {
          line-height: 1.12;
        }

        .description-stats {
          grid-template-columns: 1fr;
          row-gap: 12px;
        }

        .description-stat + .description-stat {
          border-left: none;
          border-top: none;
        }

        .gallery-more .btn {
          width: 100%;
          justify-content: center;
        }

        .gallery-grid--mosaic .gallery-card:first-child {
          grid-column: span 2;
          grid-row: span 1;
        }

        .gallery-grid--masonry {
          column-count: 1;
        }

        .gallery-modal-content {
          width: 100vw;
          height: 100vh;
          border-radius: 0;
        }

        .gallery-stage {
          padding: 6px 28px;
        }

      }

      .description-panel,
      .position-panel,
      .contact-panel {
        background: var(--card);
        border-radius: var(--radius-md);
        padding: 24px;
        box-shadow: var(--shadow-md);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .description-panel:hover,
      .position-panel:hover,
      .contact-panel:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-lg);
      }

      .description-stats {
        margin-top: 20px;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        text-align: center;
      }

      .description-stat {
        padding: 12px 8px;
      }

      .description-stat + .description-stat {
        border-left: 1px solid var(--line);
      }

      .stat-value {
        font-family: var(--font-heading);
        font-size: clamp(1.6rem, 2.4vw, 2.2rem);
        font-weight: 600;
      }

      .stat-label {
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 0.7rem;
        color: var(--muted);
      }

      .description-extras {
        margin-top: 20px;
        display: grid;
        gap: 16px;
      }

      .description-extra {
        border-top: 1px solid var(--line-soft);
        padding-top: 16px;
      }

      .description-extra h3 {
        margin: 0 0 8px;
        font-size: 1rem;
        font-family: var(--font-heading);
      }

      .description-extra p {
        margin: 0;
        color: var(--muted);
      }

      .position-map {
        margin-top: 18px;
        height: 200px;
        border-radius: var(--radius-md);
        background: linear-gradient(120deg, var(--map-accent), var(--map-accent-alt));
        overflow: hidden;
      }

      .position-map iframe {
        width: 100%;
        height: 100%;
        border: 0;
        display: block;
      }

      .position-map-link {
        display: inline-flex;
        align-items: center;
        margin-top: 12px;
        font-size: 0.9rem;
        color: var(--muted);
        text-decoration: underline;
        text-underline-offset: 4px;
      }

      .contact-grid {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        align-items: start;
      }

      .contact-grid--split {
        grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
      }

      .contact-form {
        display: grid;
        gap: 12px;
      }

      .contact-form .contact-hp {
        position: absolute;
        left: -9999px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      }

      .contact-captcha {
        display: none;
        margin-top: 4px;
      }

      .contact-captcha.is-visible {
        display: block;
      }

      .contact-form label {
        display: grid;
        gap: 6px;
      }

      .contact-form label span {
        display: block;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        color: var(--muted);
        margin-bottom: 6px;
      }

      .contact-form input,
      .contact-form textarea {
        width: 100%;
        border-radius: 12px;
        border: 1px solid var(--field-border);
        padding: 12px 14px;
        font-family: inherit;
        font-size: 0.95rem;
        background: var(--field-bg);
        color: var(--ink);
      }

      .contact-form textarea {
        resize: vertical;
        min-height: 120px;
      }

      .contact-card {
        display: grid;
        gap: 10px;
        padding: 18px 16px;
        border-radius: var(--radius-md);
        background: var(--card-muted);
      }

      .contact-label {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        color: var(--muted);
      }

      .contact-helper {
        color: var(--muted);
        font-size: 0.9rem;
      }

      .contact-item span {
        display: block;
        font-size: 0.75rem;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.15em;
        margin-bottom: 6px;
      }

      .faq-list {
        display: grid;
        gap: 16px;
      }

      .faq-item {
        border-radius: var(--radius-md);
        background: var(--card);
        padding: 16px 20px;
        box-shadow: var(--shadow-soft);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .faq-item:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-md);
      }

      .faq-item summary {
        cursor: pointer;
        font-weight: 600;
        list-style: none;
      }

      .faq-item summary::marker,
      .faq-item summary::-webkit-details-marker {
        display: none;
      }

      .faq-answer {
        margin-top: 12px;
        color: var(--muted);
      }

      footer {
        padding: clamp(48px, 8vw, 96px) clamp(24px, 8vw, 120px);
      }

      .footer-card {
        background: var(--footer-bg);
        color: var(--footer-ink);
        border-radius: var(--radius-lg);
        padding: clamp(28px, 4vw, 40px);
        display: grid;
        gap: 16px;
        box-shadow: var(--shadow);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .footer-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-xl);
      }

      [data-reveal] {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity 0.6s ease, transform 0.6s ease;
        transition-delay: var(--reveal-delay, 0ms);
      }

      [data-reveal].is-visible {
        opacity: 1;
        transform: translateY(0);
      }

      @media (prefers-reduced-motion: reduce) {
        * {
          scroll-behavior: auto !important;
        }

        [data-reveal] {
          opacity: 1;
          transform: none;
          transition: none;
        }

        .service-card,
        .gallery-card,
        .position-panel,
        .contact-panel,
        .faq-item,
        .footer-card,
        .btn {
          transition: none;
          transform: none;
        }
      }

      .footer-card h3 {
        font-family: var(--font-heading);
        margin: 0;
        font-size: clamp(1.6rem, 2.6vw, 2.2rem);
      }

      .footer-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .footer-note {
        color: var(--footer-note);
        font-size: 0.85rem;
      }
    </style>
  </head>
  <body>
    <div class="preview-banner" role="status">
      Questa è un'anteprima della landing: testi e dettagli possono cambiare.
    </div>
    ${orderedSectionsHtml}
    ${galleryModalHtml}

    <script>
      const links = document.querySelectorAll("[data-scroll]");
      links.forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          const target = document.querySelector(link.getAttribute("href"));
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        });
      });

      const faqItems = Array.from(document.querySelectorAll(".faq-item"));
      faqItems.forEach((item) => {
        item.addEventListener("toggle", () => {
          if (!item.open) return;
          faqItems.forEach((other) => {
            if (other !== item) {
              other.removeAttribute("open");
            }
          });
        });
      });

      const modal = document.querySelector("[data-gallery-modal]");
      const openModalBtn = document.querySelector("[data-gallery-open]");
      if (modal && openModalBtn) {
        const closeButtons = modal.querySelectorAll("[data-gallery-close]");
        const imageEl = modal.querySelector(".gallery-modal-image");
        const thumbs = Array.from(modal.querySelectorAll(".gallery-thumb"));
        const thumbsContainer = modal.querySelector(".gallery-thumbs");
        const prevBtn = modal.querySelector("[data-gallery-prev]");
        const nextBtn = modal.querySelector("[data-gallery-next]");
        const stage = modal.querySelector(".gallery-stage");
        let currentIndex = 0;
        let touchStartX = 0;
        let touchStartY = 0;
        let touchActive = false;

        const setIndex = (index) => {
          const safeIndex = Math.max(0, Math.min(index, thumbs.length - 1));
          const thumb = thumbs[safeIndex];
          if (!thumb || !imageEl) return;
          currentIndex = safeIndex;
          imageEl.src = thumb.dataset.src || "";
          imageEl.alt = thumb.dataset.alt || "Foto";
          thumbs.forEach((node) => node.classList.remove("is-active"));
          thumb.classList.add("is-active");
          if (thumbsContainer) {
            const thumbRect = thumb.getBoundingClientRect();
            const containerRect = thumbsContainer.getBoundingClientRect();
            const overflowLeft = thumbRect.left - containerRect.left;
            const overflowRight = thumbRect.right - containerRect.right;
            if (overflowLeft < 0 || overflowRight > 0) {
              const nextScrollLeft =
                thumbsContainer.scrollLeft +
                overflowLeft +
                thumbRect.width / 2 -
                containerRect.width / 2;
              thumbsContainer.scrollTo({
                left: nextScrollLeft,
                behavior: "smooth",
              });
            }
          }
          if (prevBtn) prevBtn.disabled = currentIndex === 0;
          if (nextBtn) nextBtn.disabled = currentIndex === thumbs.length - 1;
        };

        const openModal = (index) => {
          modal.classList.add("is-open");
          modal.setAttribute("aria-hidden", "false");
          document.body.style.overflow = "hidden";
          setIndex(index);
        };

        const closeModal = () => {
          modal.classList.remove("is-open");
          modal.setAttribute("aria-hidden", "true");
          document.body.style.overflow = "";
        };

        openModalBtn.addEventListener("click", () => openModal(0));

        const gridItems = document.querySelectorAll("[data-gallery-index]");
        gridItems.forEach((item) => {
          item.addEventListener("click", () => {
            const index = Number.parseInt(item.dataset.galleryIndex || "0", 10);
            openModal(index);
          });
        });

        closeButtons.forEach((button) =>
          button.addEventListener("click", closeModal)
        );

        thumbs.forEach((thumb) => {
          thumb.addEventListener("click", () => {
            const index = Number.parseInt(thumb.dataset.index || "0", 10);
            setIndex(index);
          });
        });

        if (prevBtn) {
          prevBtn.addEventListener("click", () => setIndex(currentIndex - 1));
        }
        if (nextBtn) {
          nextBtn.addEventListener("click", () => setIndex(currentIndex + 1));
        }

        if (stage) {
          stage.addEventListener("touchstart", (event) => {
            if (!modal.classList.contains("is-open")) return;
            if (event.touches.length !== 1) return;
            touchActive = true;
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
          }, { passive: true });

          stage.addEventListener("touchend", (event) => {
            if (!touchActive || !modal.classList.contains("is-open")) return;
            touchActive = false;
            const touch = event.changedTouches[0];
            const diffX = touch.clientX - touchStartX;
            const diffY = touch.clientY - touchStartY;
            if (Math.abs(diffX) < 40 || Math.abs(diffY) > Math.abs(diffX)) {
              return;
            }
            if (diffX < 0) {
              setIndex(currentIndex + 1);
            } else {
              setIndex(currentIndex - 1);
            }
          });
        }

        document.addEventListener("keydown", (event) => {
          if (!modal.classList.contains("is-open")) return;
          if (event.key === "Escape") {
            closeModal();
          }
          if (event.key === "ArrowLeft") {
            setIndex(currentIndex - 1);
          }
          if (event.key === "ArrowRight") {
            setIndex(currentIndex + 1);
          }
        });
      }

      const contactForms = document.querySelectorAll("[data-contact-form]");
      contactForms.forEach((form) => {
        const warningEl = form.querySelector("[data-contact-warning]");
        const propertyInput = form.querySelector("input[name='propertyId']");
        const submitButton = form.querySelector("button[type='submit']");
        const formStartInput = form.querySelector("[data-form-start]");
        const captchaContainer = form.querySelector("[data-turnstile]");
        const captchaTokenInput = form.querySelector("[data-turnstile-token]");
        const captchaSiteKey = captchaContainer?.getAttribute("data-sitekey");
        let captchaWidgetId = null;
        const setContactMessage = (message, options = {}) => {
          if (!warningEl) return;
          warningEl.classList.remove("is-visible", "is-success");
          if (!message) {
            warningEl.textContent = "";
            return;
          }
          warningEl.textContent = message;
          warningEl.classList.add("is-visible");
          if (options.variant === "success") {
            warningEl.classList.add("is-success");
          }
        };
        const resetFormStart = () => {
          if (formStartInput) {
            formStartInput.value = String(Date.now());
          }
        };
        const showCaptcha = () => {
          if (!captchaContainer || !captchaSiteKey) {
            setContactMessage(
              "Verifica anti-spam non disponibile. Riprova più tardi."
            );
            return false;
          }
          captchaContainer.classList.add("is-visible");
          if (captchaContainer.dataset.rendered === "true") {
            return true;
          }
          if (!window.turnstile) {
            setContactMessage(
              "Verifica anti-spam non disponibile. Riprova più tardi."
            );
            return false;
          }
          captchaWidgetId = window.turnstile.render(captchaContainer, {
            sitekey: captchaSiteKey,
            callback: (token) => {
              if (captchaTokenInput) {
                captchaTokenInput.value = token;
              }
            },
            "error-callback": () => {
              if (captchaTokenInput) {
                captchaTokenInput.value = "";
              }
            },
            "expired-callback": () => {
              if (captchaTokenInput) {
                captchaTokenInput.value = "";
              }
            },
          });
          captchaContainer.dataset.rendered = "true";
          return true;
        };
        resetFormStart();

        form.addEventListener("submit", async (event) => {
          event.preventDefault();
          setContactMessage("");
          if (!propertyInput || !propertyInput.value) {
            setContactMessage(
              "Impossibile identificare la proprietà. Riprova più tardi."
            );
            return;
          }
          const data = new FormData(form);
          const name = String(data.get("name") || "").trim();
          const contactEmailValue = String(data.get("email") || "").trim();
          const contactPhoneValue = String(data.get("phone") || "").trim();
          const message = String(data.get("message") || "").trim();
          if (!name) {
            setContactMessage("Inserisci il tuo nome.");
            return;
          }
          if (!message) {
            setContactMessage("Scrivi un messaggio.");
            return;
          }
          if (!contactEmailValue && !contactPhoneValue) {
            setContactMessage("Inserisci email o telefono.");
            return;
          }
          if (
            captchaContainer?.classList.contains("is-visible") &&
            captchaTokenInput &&
            !captchaTokenInput.value
          ) {
            setContactMessage("Completa la verifica anti-spam.");
            return;
          }
          const formStartValue = formStartInput
            ? Number(formStartInput.value)
            : Number.NaN;
          const resolvedFormStart = Number.isFinite(formStartValue)
            ? formStartValue
            : undefined;
          const payload = {
            propertyId: propertyInput.value,
            name,
            message,
            email: contactEmailValue || null,
            phone: contactPhoneValue || null,
            formStart: resolvedFormStart,
            company: String(data.get("company") || ""),
            turnstileToken: captchaTokenInput?.value || undefined,
          };
          try {
            if (submitButton) {
              submitButton.disabled = true;
            }
            const response = await fetch("/api/contact", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });
            if (!response.ok) {
              const body = await response.json().catch(() => null);
              if (
                response.status === 403 &&
                body?.error === "captcha_required"
              ) {
                showCaptcha();
                setContactMessage("Completa la verifica anti-spam.");
                return;
              }
              const errorMsg =
                body?.error || body?.message || "Errore durante l'invio.";
              setContactMessage(errorMsg);
              return;
            }
            setContactMessage(
              "Messaggio inviato, ti risponderemo al più presto.",
              { variant: "success" }
            );
            form.reset();
            resetFormStart();
            if (captchaTokenInput) {
              captchaTokenInput.value = "";
            }
            if (captchaContainer) {
              captchaContainer.classList.remove("is-visible");
            }
            if (captchaWidgetId && window.turnstile) {
              window.turnstile.reset(captchaWidgetId);
            }
          } catch (error) {
            setContactMessage(
              "Errore di rete durante l'invio. Riprova più tardi."
            );
          } finally {
            if (submitButton) {
              submitButton.disabled = false;
            }
          }
        });
      });

      const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
      if (revealItems.length > 0) {
        const prefersReducedMotion =
          window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
          revealItems.forEach((item) => item.classList.add("is-visible"));
        } else {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
              });
            },
            { threshold: 0.15 }
          );

          revealItems.forEach((item) => observer.observe(item));
        }
      }
    </script>
  </body>
</html>`;
};
