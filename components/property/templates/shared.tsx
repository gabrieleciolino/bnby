import type { PropertySchema } from "@/components/property/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type PropertyTemplateProps = PropertySchema;

const HIGHLIGHT_KEYWORDS = [
  "piscina",
  "pool",
  "vista",
  "mare",
  "lake",
  "montagna",
  "jacuzzi",
  "spa",
  "sauna",
  "parcheggio",
  "garage",
  "wifi",
  "aria",
  "condizionata",
  "giardino",
  "terrazza",
  "camino",
  "colazione",
  "centro",
];

export const COMFORT_KEYWORDS = [
  "wifi",
  "aria",
  "condizionata",
  "riscaldamento",
  "tv",
  "smart",
  "lavatrice",
  "asciugatrice",
  "asciugacapelli",
  "lenzuola",
  "asciugamani",
  "cassaforte",
  "scrivania",
  "culla",
];

export const KITCHEN_KEYWORDS = [
  "cucina",
  "forno",
  "microonde",
  "frigo",
  "frigorifero",
  "piano cottura",
  "bollitore",
  "tostapane",
  "lavastoviglie",
  "macchina",
  "caff",
  "stoviglie",
  "barbecue",
  "bbq",
];

export const EXTRA_KEYWORDS = [
  "piscina",
  "pool",
  "jacuzzi",
  "spa",
  "sauna",
  "parcheggio",
  "garage",
  "giardino",
  "terrazza",
  "balcone",
  "patio",
  "cortile",
  "vista",
  "mare",
  "montagna",
  "biciclette",
  "navetta",
];

export const SPACE_KEYWORDS = [
  "giardino",
  "terrazza",
  "balcone",
  "patio",
  "cortile",
  "vista",
  "mare",
  "montagna",
  "camino",
  "piscina",
  "pool",
  "spa",
];

export const defaultFaqs = [
  {
    question: "Quali sono gli orari di check-in e check-out?",
    answer:
      "Check-in dalle 15:00, check-out entro le 11:00. Orari flessibili su richiesta.",
  },
  {
    question: "Il parcheggio e incluso?",
    answer:
      "Se disponibile, lo specifichiamo nei servizi. In alternativa ti indichiamo le opzioni nelle vicinanze.",
  },
  {
    question: "Sono ammessi animali domestici?",
    answer:
      "Dipende dalla struttura. Contattaci per conferma e indicazioni specifiche.",
  },
  {
    question: "Il WiFi e veloce per lavorare?",
    answer:
      "La maggior parte delle strutture offre una connessione stabile. Chiedici i dettagli per questa casa.",
  },
  {
    question: "Qual e la politica di cancellazione?",
    answer:
      "Consulta la sezione cancellazione o scrivici: rispondiamo in tempi rapidi.",
  },
];

type ServiceGroupDefinition = {
  label: string;
  keywords: string[];
};

export type ServiceGroup = {
  label: string;
  items: string[];
};

export type ContactLine = {
  label: string;
  value: string;
  href?: string;
  type: "name" | "email" | "phone";
};

const FALLBACK_GALLERY_HINT =
  "Aggiungi almeno 8-12 foto per valorizzare al massimo gli spazi.";

const formatCount = (value: number, singular: string, plural: string) =>
  `${value} ${value === 1 ? singular : plural}`;

const scoreService = (service: string) => {
  const lower = service.toLowerCase();
  return HIGHLIGHT_KEYWORDS.reduce(
    (score, keyword) => score + (lower.includes(keyword) ? 2 : 0),
    0
  );
};

const hasService = (services: string[], keywords: string[]) => {
  const lowerKeywords = keywords.map((keyword) => keyword.toLowerCase());
  return services.some((service) =>
    lowerKeywords.some((keyword) => service.toLowerCase().includes(keyword))
  );
};

export function getGalleryUrls(gallery: PropertySchema["gallery"] | undefined) {
  if (!gallery) {
    return [];
  }

  return gallery.flatMap((item) => (typeof item === "string" ? [item] : []));
}

export function formatCapacity(info: PropertySchema["info"]) {
  return [
    formatCount(info.guests, "ospite", "ospiti"),
    formatCount(info.rooms, "camera", "camere"),
    formatCount(info.bathrooms, "bagno", "bagni"),
  ].join(" · ");
}

export function getMicroUsp(
  info: PropertySchema["info"],
  position: PropertySchema["position"],
  services: string[]
) {
  const city = position?.city;

  if (hasService(services, ["piscina", "pool", "jacuzzi", "spa"])) {
    return "Piscina privata e atmosfera esclusiva";
  }

  if (hasService(services, ["vista", "mare", "montagna", "panorama"])) {
    return city
      ? `Vista aperta su ${city} e spazi scenici`
      : "Vista aperta e spazi scenici";
  }

  if (city) {
    return `Accoglienza curata nel cuore di ${city}`;
  }

  return `Spazi pensati per ${info.guests} ospiti`;
}

export function getHighlightedServices(services: string[]) {
  const cleaned = services.map((service) => service.trim()).filter(Boolean);

  return cleaned
    .sort((a, b) => scoreService(b) - scoreService(a) || a.localeCompare(b))
    .slice(0, 6);
}

export function categorizeServices(
  services: string[],
  definitions: ServiceGroupDefinition[]
) {
  const cleaned = services.map((service) => service.trim()).filter(Boolean);
  const buckets: ServiceGroup[] = definitions.map((definition) => ({
    label: definition.label,
    items: [],
  }));

  const remaining: string[] = [];

  cleaned.forEach((service) => {
    const lower = service.toLowerCase();
    const matchIndex = definitions.findIndex((definition) =>
      definition.keywords.some((keyword) => lower.includes(keyword))
    );

    if (matchIndex >= 0) {
      buckets[matchIndex].items.push(service);
    } else {
      remaining.push(service);
    }
  });

  remaining.forEach((service, index) => {
    if (buckets.length === 0) {
      return;
    }
    buckets[index % buckets.length].items.push(service);
  });

  if (buckets.every((bucket) => bucket.items.length === 0)) {
    return [
      {
        label: "Servizi",
        items: cleaned,
      },
    ];
  }

  return buckets;
}

export function getDescriptionParagraphs(
  description: string | undefined,
  maxParagraphs = 3
) {
  const trimmed = description?.trim();

  if (!trimmed) {
    return [];
  }

  const sentences = trimmed
    .replace(/([.!?])\s+/g, "$1|")
    .split("|")
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length <= maxParagraphs) {
    return sentences;
  }

  const paragraphs: string[] = [];
  let index = 0;

  for (let i = 0; i < maxParagraphs; i += 1) {
    const remaining = sentences.length - index;
    const chunksLeft = maxParagraphs - i;
    const chunkSize = Math.ceil(remaining / chunksLeft);
    paragraphs.push(sentences.slice(index, index + chunkSize).join(" "));
    index += chunkSize;
  }

  return paragraphs;
}

export function getContactLines(contact: PropertySchema["contact"]) {
  const lines: ContactLine[] = [];

  if (contact?.name?.trim()) {
    lines.push({
      label: "Referente",
      value: contact.name.trim(),
      type: "name",
    });
  }

  if (contact?.email?.trim()) {
    const email = contact.email.trim();
    lines.push({
      label: "Email",
      value: email,
      href: `mailto:${email}`,
      type: "email",
    });
  }

  if (contact?.phone?.trim()) {
    const phone = contact.phone.trim();
    const phoneHref = phone.replace(/\s+/g, "");
    lines.push({
      label: "Telefono",
      value: phone,
      href: `tel:${phoneHref}`,
      type: "phone",
    });
  }

  return lines;
}

export function GalleryFallback({
  title = "La galleria non e ancora completa",
  hint = FALLBACK_GALLERY_HINT,
  className,
}: {
  title?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-100 via-white to-slate-200 px-8 py-14 text-center",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="absolute -top-16 right-0 h-36 w-36 rounded-full bg-slate-300/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-20 left-0 h-40 w-40 rounded-full bg-slate-200/60 blur-3xl"
      />
      <div className="relative space-y-3">
        <div className="mx-auto mb-6 h-40 max-w-md overflow-hidden rounded-2xl border border-white bg-gradient-to-br from-slate-300/40 via-white to-slate-200">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.15),_transparent_60%)]" />
        </div>
        <p className="font-display text-lg">{title}</p>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}

export function StickyCta({
  label,
  href,
  helper,
}: {
  label: string;
  href: string;
  helper?: string;
}) {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-4 md:hidden">
      <div className="glass-card flex flex-col gap-2 rounded-2xl px-4 py-3">
        {helper && (
          <p className="text-xs font-medium text-muted-foreground">{helper}</p>
        )}
        <Button asChild className="w-full">
          <a href={href}>{label}</a>
        </Button>
      </div>
    </div>
  );
}

export function GalleryOverlay({
  images,
  toggleId,
  buttonLabel = "Mostra altre foto",
  children,
}: {
  images: string[];
  toggleId: string;
  buttonLabel?: string;
  children: ReactNode;
}) {
  const hasOverflow = images.length > 6;

  if (!hasOverflow) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <input id={toggleId} type="checkbox" className="peer sr-only" />
      {children}
      <div className="mt-6 flex justify-center">
        <Button asChild variant="outline">
          <label htmlFor={toggleId}>{buttonLabel}</label>
        </Button>
      </div>
      <div className="fixed inset-0 z-50 hidden items-center justify-center bg-black/70 px-4 py-6 peer-checked:flex">
        <div className="relative max-h-full w-full max-w-6xl overflow-hidden rounded-3xl bg-background text-foreground shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Galleria completa
            </p>
            <Button asChild variant="outline" size="sm">
              <label htmlFor={toggleId}>Chiudi</label>
            </Button>
          </div>
          <div className="max-h-[80vh] overflow-y-auto p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="h-56 w-full rounded-2xl object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
