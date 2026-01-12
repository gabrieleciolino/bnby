import { PropertyFormValues } from "@/components/property/schema";

type AnyRecord = Record<string, unknown>;

export type BookingParseResult = {
  values: Partial<PropertyFormValues>;
  warnings: string[];
};

const serviceMatchers = [
  { id: "washing-machine", keywords: ["lavatrice"] },
  { id: "wifi", keywords: ["wi-fi", "wifi", "internet"] },
  { id: "tv", keywords: ["tv", "televisione"] },
  { id: "parking", keywords: ["parcheggio", "posto auto", "garage"] },
  { id: "pool", keywords: ["piscina", "idromassaggio", "jacuzzi"] },
  { id: "garden", keywords: ["giardino", "cortile", "patio", "terrazza"] },
  {
    id: "seaview",
    keywords: ["vista mare", "vista sulla spiaggia", "spiaggia", "lungomare"],
  },
];

const isRecord = (value: unknown): value is AnyRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");

const extractJsonLd = (html: string): AnyRecord | null => {
  const scripts = html.match(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );
  if (!scripts) {
    return null;
  }

  for (const script of scripts) {
    const contentMatch = script.match(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i
    );
    const content = contentMatch?.[1]?.trim();
    if (!content) continue;
    try {
      const parsed = JSON.parse(content);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        if (!isRecord(item)) continue;
        const type = asString(item["@type"]);
        if (type && /hotel|lodgingbusiness/i.test(type)) {
          return item;
        }
      }
    } catch {
      continue;
    }
  }

  return null;
};

const readMetaContent = (html: string, selector: string): string | null => {
  if (typeof DOMParser !== "undefined") {
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const node = doc.querySelector(selector);
      const content = node?.getAttribute("content") ?? node?.getAttribute("href");
      return content ? decodeHtmlEntities(content) : null;
    } catch {
      return null;
    }
  }

  const attr =
    selector.startsWith("link") || selector.includes("href")
      ? "href"
      : "content";
  const nameMatch = selector.match(/\[(name|property)=["']([^"']+)["']\]/i);
  if (nameMatch) {
    const key = nameMatch[2];
    const regex = new RegExp(
      `<meta[^>]+(?:name|property)=["']${key}["'][^>]+${attr}=["']([^"']+)["']`,
      "i"
    );
    const match = html.match(regex);
    return match?.[1] ? decodeHtmlEntities(match[1]) : null;
  }

  const linkMatch = selector.match(/\[rel=["']([^"']+)["']\]/i);
  if (linkMatch) {
    const rel = linkMatch[1];
    const regex = new RegExp(
      `<link[^>]+rel=["']${rel}["'][^>]+${attr}=["']([^"']+)["']`,
      "i"
    );
    const match = html.match(regex);
    return match?.[1] ? decodeHtmlEntities(match[1]) : null;
  }

  return null;
};

const extractLatLng = (html: string): { lat: number; lng: number } | null => {
  const latMatch = html.match(
    /b_map_center_latitude\s*=\s*([0-9.\-]+)/i
  );
  const lngMatch = html.match(
    /b_map_center_longitude\s*=\s*([0-9.\-]+)/i
  );
  const lat = latMatch ? Number.parseFloat(latMatch[1]) : NaN;
  const lng = lngMatch ? Number.parseFloat(lngMatch[1]) : NaN;
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return { lat, lng };
  }
  return null;
};

const extractGallery = (html: string): string[] => {
  const urls = new Set<string>();

  if (typeof DOMParser !== "undefined") {
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const images = Array.from(
        doc.querySelectorAll('img[src*="cf.bstatic.com/xdata/images/hotel"]')
      );
      for (const img of images) {
        const src = img.getAttribute("src");
        if (src) {
          urls.add(decodeHtmlEntities(src));
        }
      }
    } catch {
      // ignore
    }
  }

  if (urls.size === 0) {
    const matches = html.match(
      /https?:\/\/cf\.bstatic\.com\/xdata\/images\/hotel\/[^"'\\s>]+/gi
    );
    if (matches) {
      for (const url of matches) {
        urls.add(decodeHtmlEntities(url));
      }
    }
  }

  return Array.from(urls);
};

const extractFacilities = (html: string): string[] => {
  const facilities = new Set<string>();

  if (typeof DOMParser !== "undefined") {
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const wrapper = doc.querySelector(
        '[data-testid="property-most-popular-facilities-wrapper"]'
      );
      if (wrapper) {
        const items = Array.from(wrapper.querySelectorAll("li"));
        for (const item of items) {
          const text = item.textContent?.trim();
          if (text) {
            facilities.add(text.replace(/\s+/g, " "));
          }
        }
      }
    } catch {
      // ignore
    }
  }

  if (facilities.size === 0) {
    const regex = /<span[^>]*class=["'][^"']*f6b6d2a959[^"']*["'][^>]*>([^<]+)<\/span>/gi;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(html)) !== null) {
      const text = decodeHtmlEntities(match[1].trim());
      if (text) {
        facilities.add(text);
      }
    }
  }

  return Array.from(facilities);
};

const mapFacilitiesToServices = (facilities: string[]): string[] => {
  const found = new Set<string>();
  const normalized = facilities.map((facility) => facility.toLowerCase());

  for (const matcher of serviceMatchers) {
    for (const keyword of matcher.keywords) {
      if (normalized.some((title) => title.includes(keyword))) {
        found.add(matcher.id);
        break;
      }
    }
  }

  return Array.from(found);
};

const extractBookingUrl = (html: string): string | null => {
  const canonical = readMetaContent(html, 'link[rel="canonical"]');
  if (canonical) return canonical;
  const ogUrl = readMetaContent(html, 'meta[property="og:url"]');
  if (ogUrl) return ogUrl;
  const twitterUrl = readMetaContent(html, 'meta[name="twitter:app:url:iphone"]');
  if (twitterUrl) return twitterUrl;
  return null;
};

export const parseBookingHtml = (html: string): BookingParseResult => {
  const warnings: string[] = [];
  const values: Partial<PropertyFormValues> = {};

  if (!html.trim()) {
    warnings.push("empty_html");
    return { values, warnings };
  }

  const jsonLd = extractJsonLd(html);
  const info: Partial<PropertyFormValues["info"]> = {};

  const title =
    (jsonLd && asString(jsonLd.name)) ||
    readMetaContent(html, 'meta[property="og:title"]') ||
    readMetaContent(html, 'meta[name="twitter:title"]');
  if (title) {
    info.name = title;
  }

  const description =
    (jsonLd && asString(jsonLd.description)) ||
    readMetaContent(html, 'meta[name="description"]') ||
    readMetaContent(html, 'meta[property="og:description"]');
  if (description) {
    info.description = description;
  }

  if (Object.keys(info).length > 0) {
    values.info = info as PropertyFormValues["info"];
  }

  if (jsonLd && isRecord(jsonLd.address)) {
    const address = asString(jsonLd.address.streetAddress);
    if (address) {
      values.position = { address };
    }
  }

  const latLng = extractLatLng(html);
  if (latLng && values.position?.address) {
    values.position = {
      ...(values.position ?? {}),
      lat: latLng.lat,
      lng: latLng.lng,
    };
  }

  const gallery = extractGallery(html);
  const ogImage = readMetaContent(html, 'meta[property="og:image"]');
  const twitterImage = readMetaContent(html, 'meta[name="twitter:image"]');
  const imageCandidates = new Set<string>(gallery);
  if (ogImage) imageCandidates.add(ogImage);
  if (twitterImage) imageCandidates.add(twitterImage);
  if (jsonLd) {
    const jsonImage = jsonLd.image;
    if (typeof jsonImage === "string") {
      imageCandidates.add(jsonImage);
    }
    if (Array.isArray(jsonImage)) {
      for (const item of jsonImage) {
        if (typeof item === "string") {
          imageCandidates.add(item);
        }
      }
    }
  }
  if (imageCandidates.size > 0) {
    values.gallery = Array.from(imageCandidates);
  }

  const facilities = extractFacilities(html);
  const mappedServices = mapFacilitiesToServices(facilities);
  if (mappedServices.length > 0) {
    values.services = mappedServices;
  }

  const bookingUrl = extractBookingUrl(html);
  if (bookingUrl) {
    values.booking = {
      ...(values.booking ?? {}),
      bookingUrl,
    };
  }

  if (!values.info && !values.gallery && !values.position) {
    warnings.push("booking_data_missing");
  }

  return { values, warnings };
};
