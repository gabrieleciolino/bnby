import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import {
  COMFORT_KEYWORDS,
  EXTRA_KEYWORDS,
  SPACE_KEYWORDS,
  GalleryFallback,
  GalleryOverlay,
  StickyCta,
  categorizeServices,
  formatCapacity,
  getContactLines,
  getGalleryUrls,
  getMicroUsp,
  type PropertyTemplateProps,
} from "./shared";

export default function StoryExperienceTemplate({
  info,
  services = [],
  gallery,
  position,
  contact,
  faqs,
}: PropertyTemplateProps) {
  const galleryUrls = getGalleryUrls(gallery);
  const galleryPreview = galleryUrls.slice(0, 6);
  const description =
    info.description?.trim() ??
    "Racconta qui l'atmosfera della casa, i ritmi lenti e le esperienze che si possono vivere nei dintorni.";
  const storySnippet =
    description.length > 180 ? `${description.slice(0, 180)}...` : description;
  const subtitle = position?.city
    ? `Uno spazio per ${info.guests} ospiti nel cuore di ${position.city}`
    : `Uno spazio per ${info.guests} ospiti pensato per rallentare`;
  const groupedServices = categorizeServices(services, [
    { label: "Comfort", keywords: COMFORT_KEYWORDS },
    { label: "Spazi", keywords: SPACE_KEYWORDS },
    { label: "Extra", keywords: EXTRA_KEYWORDS },
  ]);
  const contactLines = getContactLines(contact);
  const houseRules = info.houseRules?.trim();
  const faqItems = faqs ?? [];
  const cancellationCopy =
    info.cancellationPolicy?.trim() ??
    "Cancellazione flessibile su richiesta. Scrivici per i dettagli.";
  const captions = [
    "Luce naturale e dettagli che raccontano il territorio.",
    "Spazi pensati per condividere momenti lenti.",
    "Un rifugio intimo per una pausa fuori dal tempo.",
    "Dettagli curati per un soggiorno senza pensieri.",
  ];

  return (
    <div className="bg-background text-foreground pb-24 md:pb-0">
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.25),_transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="absolute -left-24 top-24 h-60 w-60 rounded-full bg-amber-200/40 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-3xl space-y-6 fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700/70">
              Story experience
            </p>
            <p className="text-sm text-amber-700/70">
              {getMicroUsp(info, position, services)}
            </p>
            <h1 className="font-display text-4xl md:text-5xl">{info.name}</h1>
            <p className="text-base text-slate-700">{subtitle}</p>
            <div className="inline-flex items-center rounded-full border border-amber-200 bg-white/70 px-4 py-2 text-sm text-slate-700">
              {formatCapacity(info)}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:opacity-90"
              >
                <a href="#contatti">Richiedi disponibilita</a>
              </Button>
              <Button asChild variant="outline">
                <a href="#gallery">Vedi le foto</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-amber-100 py-12">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            <h2 className="font-display text-2xl md:text-3xl">
              L'esperienza
            </h2>
            <p className="text-lg leading-relaxed text-slate-700">
              {description}
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl border border-amber-100 bg-white/70 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700/70">
                Ospiti
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {info.guests}
              </p>
            </div>
            <div className="rounded-3xl border border-amber-100 bg-white/70 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700/70">
                Camere
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {info.rooms}
              </p>
            </div>
            <div className="rounded-3xl border border-amber-100 bg-white/70 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700/70">
                Bagni
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {info.bathrooms}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="py-12">
        <div className="mx-auto max-w-6xl space-y-8 px-6">
          <div className="space-y-2">
            <h2 className="font-display text-2xl md:text-3xl">
              Gallery scrollytelling
            </h2>
            <p className="text-sm text-slate-600">
              Immagini grandi alternate a brevi racconti.
            </p>
          </div>
          {galleryUrls.length > 0 ? (
            <GalleryOverlay
              images={galleryUrls}
              toggleId="story-experience-modal"
              buttonLabel="Mostra tutta la gallery"
            >
              <div className="space-y-10">
                {galleryPreview.map((image, index) => {
                  const caption = captions[index % captions.length];
                  const isReversed = index % 2 !== 0;

                  return (
                    <div
                      key={`${image}-${index}`}
                      className={cn(
                        "grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]",
                        isReversed && "md:grid-cols-[0.8fr_1.2fr]"
                      )}
                    >
                      <img
                        src={image}
                        alt={`Dettaglio ${index + 1} di ${info.name}`}
                        className={`h-80 w-full rounded-3xl object-cover shadow-xl ${
                          isReversed ? "md:order-2" : ""
                        }`}
                      />
                      <div
                        className={`space-y-3 ${
                          isReversed ? "md:order-1" : ""
                        }`}
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700/70">
                          Capitolo {index + 1}
                        </p>
                        <p className="text-lg font-medium text-slate-800">
                          {caption}
                        </p>
                        <p className="text-sm text-slate-600">{storySnippet}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GalleryOverlay>
          ) : (
            <GalleryFallback />
          )}
        </div>
      </section>

      <section id="servizi" className="bg-white/70 py-12">
        <div className="mx-auto max-w-6xl space-y-8 px-6">
          <div className="space-y-2">
            <h2 className="font-display text-2xl md:text-3xl">
              Servizi in contesto
            </h2>
            <p className="text-sm text-slate-600">
              Ogni comfort racconta un momento del soggiorno.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {groupedServices.map((group) => (
              <div
                key={group.label}
                className="rounded-3xl border border-amber-100 bg-white p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700/70">
                  {group.label}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {group.items.length > 0 ? (
                    group.items.map((service) => (
                      <li key={service}>{service}</li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">
                      Servizi in arrivo.
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="posizione" className="py-12">
        <div className="mx-auto max-w-6xl space-y-6 px-6">
          <div className="flex items-center gap-3 text-slate-600">
            <MapPin className="size-5" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em]">
              Posizione
            </p>
          </div>
          {position ? (
            <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-3">
                <h3 className="font-display text-2xl">
                  {position.city}, {position.country}
                </h3>
                <p className="text-sm text-slate-600">{position.address}</p>
                <p className="text-sm text-slate-600">
                  Punto di partenza ideale per esplorare borghi, natura e
                  tradizioni locali.
                </p>
                <Button asChild variant="outline">
                  <a href="#contatti">Indicazioni</a>
                </Button>
              </div>
              <div className="relative overflow-hidden rounded-3xl border border-amber-100 bg-amber-50">
                <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 via-amber-50 to-white" />
                <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-600">
                  Mappa e indicazioni
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Inserisci la posizione per guidare gli ospiti.
            </p>
          )}
        </div>
      </section>

      <section id="fiducia" className="border-t border-amber-100 py-12">
        <div className="mx-auto max-w-6xl space-y-8 px-6">
          <div className="space-y-2">
            <h2 className="font-display text-2xl md:text-3xl">
              Cancellazione e contatti
            </h2>
            <p className="text-sm text-slate-600">
              Una chiusura chiara, con assistenza reale.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-amber-100 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700/70">
                Servizi chiave
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(services.length > 0 ? services.slice(0, 6) : []).map(
                  (service) => (
                    <span
                      key={service}
                      className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      {service}
                    </span>
                  )
                )}
                {services.length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    Inserisci i comfort principali.
                  </span>
                )}
              </div>
            </div>
            <div className="rounded-3xl border border-amber-100 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700/70">
                Cancellazione
              </p>
              <p className="mt-4 text-sm text-slate-700">{cancellationCopy}</p>
            </div>
            <div className="rounded-3xl border border-amber-100 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700/70">
                Regole di casa
              </p>
              <p className="mt-4 text-sm text-slate-700">
                {houseRules ??
                  "Aggiungi le regole di casa per chiarire orari e limiti."}
              </p>
            </div>
            <div
              id="contatti"
              className="rounded-3xl border border-amber-100 bg-white p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700/70">
                Contatti
              </p>
              <div className="mt-4 space-y-3 text-sm">
                {contactLines.length > 0 ? (
                  contactLines.map((line) => (
                    <div key={line.label} className="space-y-1">
                      <p className="text-xs text-slate-500">{line.label}</p>
                      {line.href ? (
                        <a
                          className="font-semibold text-slate-900 hover:text-slate-700"
                          href={line.href}
                        >
                          {line.value}
                        </a>
                      ) : (
                        <p className="font-semibold text-slate-900">
                          {line.value}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Aggiungi un contatto per facilitare le richieste.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white/70 py-12">
        <div className="mx-auto max-w-6xl space-y-8 px-6">
          <div className="space-y-2">
            <h2 className="font-display text-2xl md:text-3xl">FAQ</h2>
            <p className="text-sm text-slate-600">
              Domande frequenti per arrivare preparati.
            </p>
          </div>
          {faqItems.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {faqItems.map((faq) => (
                <details
                  key={faq.question}
                  className="rounded-2xl border border-amber-100 bg-white px-4 py-3"
                >
                  <summary className="cursor-pointer text-sm font-semibold text-slate-800">
                    {faq.question}
                  </summary>
                  <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Inserisci FAQ per guidare gli ospiti prima dell'arrivo.
            </p>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-900 py-16 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.25),_transparent_70%)]"
        />
        <div className="relative mx-auto max-w-5xl space-y-6 px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl">
            Condividi la tua esperienza a {info.name}
          </h2>
          <p className="text-sm text-white/70">
            Una richiesta, un racconto su misura, una proposta dedicata.
          </p>
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:opacity-90"
          >
            <a href="#contatti">Contattaci ora</a>
          </Button>
        </div>
      </section>

      <StickyCta
        label="Richiedi disponibilita"
        href="#contatti"
        helper="Risposta rapida"
      />
    </div>
  );
}
