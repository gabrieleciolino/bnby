import { PropertyFormValues } from "@/components/property/schema";

type AnyRecord = Record<string, unknown>;

export type AirbnbParseResult = {
  values: Partial<PropertyFormValues>;
  warnings: string[];
};

const serviceMatchers = [
  { id: "washing-machine", keywords: ["lavatrice"] },
  { id: "wifi", keywords: ["wi-fi", "wifi"] },
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

const asNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

const asArray = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");

const extractDataInjectorInstances = (html: string): unknown | null => {
  if (!html.trim()) {
    return null;
  }

  let content: string | null = null;

  if (typeof DOMParser !== "undefined") {
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      content =
        doc
          .querySelector("script#data-injector-instances")
          ?.textContent?.trim() ?? null;
    } catch {
      content = null;
    }
  }

  if (!content) {
    const match = html.match(
      /<script[^>]*id=["']data-injector-instances["'][^>]*>([\s\S]*?)<\/script>/i
    );
    content = match?.[1]?.trim() ?? null;
  }

  if (!content) {
    return null;
  }

  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
};

const findObjectWithKey = (root: unknown, key: string): AnyRecord | null => {
  const stack = [root];

  while (stack.length) {
    const current = stack.pop();

    if (isRecord(current)) {
      if (Object.prototype.hasOwnProperty.call(current, key)) {
        return current;
      }
      stack.push(...Object.values(current));
      continue;
    }

    if (Array.isArray(current)) {
      stack.push(...current);
    }
  }

  return null;
};

const findLatLng = (root: unknown): { lat: number; lng: number } | null => {
  const stack = [root];

  while (stack.length) {
    const current = stack.pop();

    if (isRecord(current)) {
      const lat = asNumber(current.lat ?? current.latitude);
      const lng = asNumber(current.lng ?? current.longitude);
      if (typeof lat === "number" && typeof lng === "number") {
        return { lat, lng };
      }
      stack.push(...Object.values(current));
      continue;
    }

    if (Array.isArray(current)) {
      stack.push(...current);
    }
  }

  return null;
};

const isBookingUrl = (value: string) =>
  /^https?:\/\/[^"'\\s]+\/rooms\/\d+/i.test(value);

const extractBookingUrlFromHtml = (html: string): string | null => {
  if (!html.trim()) {
    return null;
  }

  if (typeof DOMParser !== "undefined") {
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const ogUrl =
        doc.querySelector('meta[property="og:url"]')?.getAttribute("content");
      if (ogUrl && isBookingUrl(ogUrl)) {
        return ogUrl;
      }
      const twitterUrl =
        doc.querySelector('meta[name="twitter:url"]')?.getAttribute("content");
      if (twitterUrl && isBookingUrl(twitterUrl)) {
        return twitterUrl;
      }
      const canonicalUrl =
        doc.querySelector('link[rel="canonical"]')?.getAttribute("href");
      if (canonicalUrl && isBookingUrl(canonicalUrl)) {
        return canonicalUrl;
      }
    } catch {
      return null;
    }
  }

  const ogMatch = html.match(
    /<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i
  );
  if (ogMatch?.[1] && isBookingUrl(ogMatch[1])) {
    return decodeHtmlEntities(ogMatch[1]);
  }

  const twitterMatch = html.match(
    /<meta[^>]+name=["']twitter:url["'][^>]+content=["']([^"']+)["']/i
  );
  if (twitterMatch?.[1] && isBookingUrl(twitterMatch[1])) {
    return decodeHtmlEntities(twitterMatch[1]);
  }

  const canonicalMatch = html.match(
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i
  );
  if (canonicalMatch?.[1] && isBookingUrl(canonicalMatch[1])) {
    return decodeHtmlEntities(canonicalMatch[1]);
  }

  return null;
};

const extractBookingUrlFromData = (root: unknown): string | null => {
  const preferredKeys = [
    "canonicalUrl",
    "pdpLink",
    "ogUrl",
    "twitterUrl",
    "shareUrl",
  ];

  for (const key of preferredKeys) {
    const container = findObjectWithKey(root, key);
    if (container && isRecord(container)) {
      const value = asString(container[key]);
      if (value && isBookingUrl(value)) {
        return value;
      }
    }
  }

  const canonicalContainer = findObjectWithKey(root, "canonical_url");
  if (canonicalContainer && isRecord(canonicalContainer)) {
    const host = asString(canonicalContainer.canonical_host);
    const path = asString(canonicalContainer.canonical_url);
    if (host && path && path.includes("/rooms/")) {
      const url = path.startsWith("http") ? path : `https://${host}${path}`;
      if (isBookingUrl(url)) {
        return url;
      }
    }
  }

  const stack = [root];
  while (stack.length) {
    const current = stack.pop();
    if (isRecord(current)) {
      for (const value of Object.values(current)) {
        if (typeof value === "string" && isBookingUrl(value)) {
          return value;
        }
        if (isRecord(value) || Array.isArray(value)) {
          stack.push(value);
        }
      }
      continue;
    }
    if (Array.isArray(current)) {
      stack.push(...current);
    }
  }

  return null;
};

const getSections = (stayProductDetailPage: AnyRecord): AnyRecord[] => {
  const sectionsContainer = isRecord(stayProductDetailPage.sections)
    ? stayProductDetailPage.sections
    : null;
  const rawSections = asArray(sectionsContainer?.sections);

  return rawSections
    .map((item) => (isRecord(item) ? item.section : null))
    .filter((section): section is AnyRecord => isRecord(section));
};

const findSection = (
  sections: AnyRecord[],
  typename: string,
  predicate?: (section: AnyRecord) => boolean
): AnyRecord | null => {
  for (const section of sections) {
    if (asString(section.__typename) !== typename) {
      continue;
    }
    if (!predicate || predicate(section)) {
      return section;
    }
  }
  return null;
};

const stripHtml = (html: string): string => {
  const normalized = html.replace(/<br\s*\/?>/gi, "\n");

  if (typeof DOMParser !== "undefined") {
    const doc = new DOMParser().parseFromString(normalized, "text/html");
    return doc.body.textContent?.trim() ?? "";
  }

  return normalized
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .trim();
};

const extractDescription = (section: AnyRecord | null): string | null => {
  if (!section) {
    return null;
  }

  const items = asArray(section.items);
  const parts = items
    .map((item) => {
      if (!isRecord(item)) {
        return null;
      }
      const title = asString(item.title);
      const html = isRecord(item.html) ? asString(item.html.htmlText) : null;
      if (!html) {
        return null;
      }
      const text = stripHtml(html);
      if (!text) {
        return null;
      }
      if (title) {
        return `${title}\n${text}`;
      }
      return text;
    })
    .filter((part): part is string => Boolean(part));

  const joined = parts.join("\n\n").trim();
  return joined.length > 0 ? joined : null;
};

const getOverviewLabels = (stayProductDetailPage: AnyRecord): string[] => {
  const sectionsContainer = isRecord(stayProductDetailPage.sections)
    ? stayProductDetailPage.sections
    : null;
  const sbuiData = isRecord(sectionsContainer?.sbuiData)
    ? sectionsContainer?.sbuiData
    : null;
  const root = isRecord(sbuiData?.sectionConfiguration)
    ? sbuiData.sectionConfiguration
    : null;
  const rootConfig = isRecord(root?.root) ? root.root : null;
  const rootSections = asArray(rootConfig?.sections);
  const firstSection = isRecord(rootSections[0]) ? rootSections[0] : null;
  const sectionData = isRecord(firstSection?.sectionData)
    ? firstSection.sectionData
    : null;
  const overviewItems = asArray(sectionData?.overviewItems);

  return overviewItems
    .map((item) => (isRecord(item) ? asString(item.title) : null))
    .filter((title): title is string => Boolean(title));
};

const getDescriptionItemLabels = (section: AnyRecord | null): string[] => {
  if (!section) {
    return [];
  }
  const items = asArray(section.descriptionItems);
  return items
    .map((item) => (isRecord(item) ? asString(item.title) : null))
    .filter((title): title is string => Boolean(title));
};

const parseNumberFromLabel = (label: string): number | null => {
  const match = label.match(/(\d+(?:[.,]\d+)?)/);
  if (!match) {
    return null;
  }
  const value = Number.parseFloat(match[1].replace(",", "."));
  return Number.isNaN(value) ? null : value;
};

const parseCounts = (labels: string[]) => {
  let guests: number | undefined;
  let rooms: number | undefined;
  let bathrooms: number | undefined;
  let beds: number | undefined;

  for (const label of labels) {
    const value = parseNumberFromLabel(label);
    if (value === null) {
      continue;
    }

    const lower = label.toLowerCase();
    if (guests === undefined && lower.includes("ospit")) {
      guests = value;
      continue;
    }
    if (
      rooms === undefined &&
      /(camer|stanza|bedroom)/.test(lower)
    ) {
      rooms = value;
      continue;
    }
    if (bathrooms === undefined && lower.includes("bagn")) {
      bathrooms = value;
      continue;
    }
    if (beds === undefined && lower.includes("lett")) {
      beds = value;
      continue;
    }
  }

  return { guests, rooms, bathrooms, beds };
};

const getAmenities = (section: AnyRecord | null): string[] => {
  if (!section) {
    return [];
  }

  const groups =
    asArray(section.seeAllAmenitiesGroups).length > 0
      ? asArray(section.seeAllAmenitiesGroups)
      : asArray(section.previewAmenitiesGroups);

  const amenities: string[] = [];
  for (const group of groups) {
    if (!isRecord(group)) {
      continue;
    }
    const items = asArray(group.amenities);
    for (const item of items) {
      if (!isRecord(item)) {
        continue;
      }
      const title = asString(item.title);
      if (title) {
        amenities.push(title);
      }
    }
  }

  return amenities;
};

const mapAmenitiesToServices = (amenities: string[]): string[] => {
  const found = new Set<string>();
  const normalized = amenities.map((amenity) => amenity.toLowerCase());

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

const extractGallery = (section: AnyRecord | null): string[] => {
  if (!section) {
    return [];
  }

  const mediaItems = asArray(section.mediaItems);
  const urls = mediaItems
    .map((item) => (isRecord(item) ? asString(item.baseUrl) : null))
    .filter((url): url is string => Boolean(url));

  return Array.from(new Set(urls));
};

const extractLocation = (
  section: AnyRecord | null
): PropertyFormValues["position"] => {
  if (!section) {
    return undefined;
  }

  const address =
    asString(section.address) ||
    asString(section.addressTitle) ||
    asString(section.subtitle);
  const subtitle = asString(section.subtitle);

  if (!address || !subtitle) {
    return undefined;
  }

  const parts = subtitle
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const city = parts[0];
  const country = parts[parts.length - 1];

  if (!city || !country) {
    return undefined;
  }

  return {
    address,
    city,
    country,
  };
};

const extractHostName = (section: AnyRecord | null): string | null => {
  if (!section) {
    return null;
  }

  const cardData = isRecord(section.cardData) ? section.cardData : null;
  return asString(cardData?.name);
};

const extractCancellationPolicy = (
  stayProductDetailPage: AnyRecord
): string | null => {
  const sectionsContainer = isRecord(stayProductDetailPage.sections)
    ? stayProductDetailPage.sections
    : null;
  const metadata = isRecord(sectionsContainer?.metadata)
    ? sectionsContainer.metadata
    : null;
  const bookingPrefetch = isRecord(metadata?.bookingPrefetchData)
    ? metadata.bookingPrefetchData
    : null;
  const policies = asArray(bookingPrefetch?.cancellationPolicies);
  const policy = isRecord(policies[0]) ? policies[0] : null;

  if (!policy) {
    return null;
  }

  const name = asString(policy.localized_cancellation_policy_name);
  const title =
    asString(policy.title) || asString(policy.book_it_module_tooltip);

  if (name && title && !title.includes(name)) {
    return `${name} - ${title}`;
  }

  return title ?? name;
};

export const parseAirbnbHtml = (html: string): AirbnbParseResult => {
  const warnings: string[] = [];
  const values: Partial<PropertyFormValues> = {};

  const data = extractDataInjectorInstances(html);
  if (!data) {
    warnings.push("data_injector_missing");
    return { values, warnings };
  }

  const container = findObjectWithKey(data, "stayProductDetailPage");
  if (!container || !isRecord(container.stayProductDetailPage)) {
    warnings.push("stay_product_missing");
    return { values, warnings };
  }

  const stayProductDetailPage = container.stayProductDetailPage;
  const sections = getSections(stayProductDetailPage);

  const titleSection = findSection(sections, "PdpTitleSection");
  const availabilitySection = findSection(
    sections,
    "AvailabilityCalendarSection"
  );
  const locationSection = findSection(sections, "LocationSection");
  const amenitiesSection = findSection(sections, "AmenitiesSection");
  const photoSection = findSection(sections, "PhotoTourModalSection");
  const hostSection = findSection(sections, "MeetYourHostSection");

  let descriptionSection = findSection(
    sections,
    "GeneralListContentSection",
    (section) =>
      asString(section.title)
        ?.toLowerCase()
        .includes("informazioni su questo spazio") ?? false
  );
  if (!descriptionSection) {
    descriptionSection = findSection(
      sections,
      "GeneralListContentSection",
      (section) => asArray(section.items).length > 0
    );
  }

  const info: Partial<PropertyFormValues["info"]> = {};

  const title =
    asString(titleSection?.title) ??
    asString(availabilitySection?.listingTitle);
  if (title) {
    info.name = title;
  }

  const description = extractDescription(descriptionSection);
  if (description) {
    info.description = description;
  }

  const overviewLabels = getOverviewLabels(stayProductDetailPage);
  const descriptionLabels = getDescriptionItemLabels(availabilitySection);
  const shareSave =
    titleSection && isRecord(titleSection.shareSave)
      ? titleSection.shareSave
      : null;
  const sharingConfig =
    shareSave && isRecord(shareSave.sharingConfig)
      ? shareSave.sharingConfig
      : null;
  const summary = asString(sharingConfig?.title) ?? null;
  const counts = parseCounts([
    ...overviewLabels,
    ...descriptionLabels,
    ...(summary ? [summary] : []),
  ]);

  const maxGuests =
    typeof availabilitySection?.maxGuestCapacity === "number"
      ? availabilitySection.maxGuestCapacity
      : undefined;

  if (typeof counts.guests === "number") {
    info.guests = counts.guests;
  } else if (typeof maxGuests === "number") {
    info.guests = maxGuests;
  }

  if (typeof counts.rooms === "number") {
    info.rooms = counts.rooms;
  }

  if (typeof counts.bathrooms === "number") {
    info.bathrooms = counts.bathrooms;
  }

  if (Object.keys(info).length > 0) {
    values.info = info as PropertyFormValues["info"];
  }

  const amenities = getAmenities(amenitiesSection);
  const mappedServices = mapAmenitiesToServices(amenities);
  if (mappedServices.length > 0) {
    values.services = mappedServices;
  }

  const gallery = extractGallery(photoSection);
  if (gallery.length > 0) {
    values.gallery = gallery;
  }

  const location = extractLocation(locationSection);
  if (location) {
    const latLng =
      findLatLng(locationSection) ?? findLatLng(stayProductDetailPage);
    if (latLng) {
      location.lat = latLng.lat;
      location.lng = latLng.lng;
    }
    values.position = location;
  }

  const hostName = extractHostName(hostSection);
  if (hostName) {
    values.contact = { name: hostName };
  }

  const bookingUrl =
    extractBookingUrlFromData(stayProductDetailPage) ??
    extractBookingUrlFromData(data) ??
    extractBookingUrlFromHtml(html);
  if (bookingUrl) {
    values.booking = {
      ...(values.booking ?? {}),
      bookingUrl,
    };
  }

  return { values, warnings };
};
