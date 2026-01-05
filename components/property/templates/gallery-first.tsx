import { Button } from "@/components/ui/button";
import { Check, MapPin, Sparkles } from "lucide-react";
import {
  GalleryOverlay,
  GalleryFallback,
  StickyCta,
  formatCapacity,
  getContactLines,
  getGalleryUrls,
  getHighlightedServices,
  getMicroUsp,
  type PropertyTemplateProps,
} from "./shared";

export default function GalleryFirstTemplate({
  info,
  services = [],
  gallery,
  position,
  contact,
  faqs,
}: PropertyTemplateProps) {
  const galleryUrls = getGalleryUrls(gallery);
  const galleryPreview = galleryUrls.slice(0, 6);
  const heroImage = galleryUrls[0];
  const highlightedServices = getHighlightedServices(services);
  const description = info.description?.trim();
  const houseRules = info.houseRules?.trim();
  const faqItems = faqs ?? [];
  const contactLines = getContactLines(contact);
  const hasContact = contactLines.length > 0;
  const cancellationCopy =
    info.cancellationPolicy?.trim() ??
    "Politica flessibile: contattaci per dettagli e soluzioni su misura.";

  return (
    <div className="bg-background text-foreground pb-24 md:pb-0">
      <section className="relative min-h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          {heroImage ? (
            <img
              src={heroImage}
              alt={`Vista principale di ${info.name}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end px-6 py-16 text-white">
          <div className="max-w-2xl space-y-6 fade-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-white/80">
              <Sparkles className="size-4" />
              <span>{getMicroUsp(info, position, services)}</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl">
              {info.name}
            </h1>
            <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm text-white/90">
              {formatCapacity(info)}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:opacity-90"
              >
                <a href="#contatti">Richiedi disponibilita</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/60 text-white hover:bg-white/10"
              >
                <a href="#gallery">Guarda tutte le foto</a>
              </Button>
            </div>
            <p className="text-sm text-white/70">
              Risposta rapida e assistenza dedicata durante il soggiorno.
            </p>
          </div>
        </div>
      </section>

      <section id="gallery" className="relative overflow-hidden py-16">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.25),_transparent_65%)]"
        />
        <div className="relative mx-auto max-w-6xl space-y-8 px-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Gallery
            </p>
            <h2 className="font-display text-3xl md:text-4xl">
              Spazi in primo piano
            </h2>
            <p className="text-sm text-slate-600">
              Scorri per vedere gli spazi.
            </p>
          </div>
          {galleryUrls.length > 0 ? (
            <GalleryOverlay
              images={galleryUrls}
              toggleId="gallery-first-modal"
            >
              <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
                {galleryPreview.map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt={`Foto ${index + 1} di ${info.name}`}
                    className="mb-4 w-full break-inside-avoid rounded-2xl object-cover shadow-lg"
                  />
                ))}
              </div>
            </GalleryOverlay>
          ) : (
            <GalleryFallback />
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl space-y-6 px-6">
          <div className="flex items-center gap-2 text-slate-600">
            <Sparkles className="size-5 text-slate-500" />
            <p className="text-sm font-medium uppercase tracking-[0.24em]">
              Highlights rapidi
            </p>
          </div>
          {highlightedServices.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {highlightedServices.map((service) => (
                <span
                  key={service}
                  className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                >
                  {service}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Aggiungi i servizi piu importanti per farli emergere.
            </p>
          )}
        </div>
      </section>

      <section id="descrizione" className="bg-white py-12">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <h2 className="font-display text-2xl md:text-3xl">
              Una descrizione che vende
            </h2>
            {description ? (
              <>
                <p className="max-h-[10.5rem] overflow-hidden text-base leading-relaxed text-slate-600">
                  {description}
                </p>
                <details className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-700">
                    Leggi di piu
                  </summary>
                  <p className="mt-3 text-sm text-slate-600">{description}</p>
                </details>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Racconta l'atmosfera della casa con 6-10 righe di testo.
              </p>
            )}
          </div>
          <div className="glass-card flex flex-col justify-between gap-6 rounded-3xl p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Consiglio rapido
            </p>
            <p className="text-lg font-medium text-slate-900">
              Le descrizioni brevi convertono di piu: racconta lo scenario,
              evidenzia il comfort e chiudi con una promessa.
            </p>
          </div>
        </div>
      </section>

      <section id="servizi" className="py-12">
        <div className="mx-auto max-w-6xl space-y-8 px-6">
          <div className="space-y-2">
            <h2 className="font-display text-2xl md:text-3xl">
              Servizi completi
            </h2>
            <p className="text-sm text-slate-600">
              Elenco completo dei comfort disponibili in struttura.
            </p>
          </div>
          {services.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {services.map((service) => (
                <div
                  key={service}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white">
                    <Check className="size-4" />
                  </span>
                  <span className="text-sm font-medium">{service}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nessun servizio inserito. Aggiungi almeno 6 comfort chiave.
            </p>
          )}
        </div>
      </section>

      <section
        id="posizione"
        className="relative overflow-hidden bg-slate-950 py-12 text-white"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(56,189,248,0.18),_transparent_70%)]"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3 text-white/70">
              <MapPin className="size-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.24em]">
                Posizione
              </p>
            </div>
            {position ? (
              <>
                <h3 className="font-display text-2xl">
                  {position.city}, {position.country}
                </h3>
                <p className="text-sm text-white/70">{position.address}</p>
              </>
            ) : (
              <>
                <h3 className="font-display text-2xl">
                  Posizione da definire
                </h3>
                <p className="text-sm text-white/70">
                  Aggiungi citta e indirizzo per abilitare le indicazioni.
                </p>
              </>
            )}
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10"
              >
                <a href="#contatti">Indicazioni</a>
              </Button>
              <Button asChild className="bg-primary text-primary-foreground">
                <a href="#contatti">Contattaci per info</a>
              </Button>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <div className="aspect-[4/3] bg-gradient-to-br from-white/20 via-white/5 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center text-sm text-white/70">
              Mappa in arrivo
            </div>
          </div>
        </div>
      </section>

      <section id="fiducia" className="bg-white py-12">
        <div className="mx-auto max-w-6xl space-y-8 px-6">
          <div className="space-y-2">
            <h2 className="font-display text-2xl md:text-3xl">
              Fiducia immediata
            </h2>
            <p className="text-sm text-slate-600">
              Tutto quello che serve per prenotare con sicurezza.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Servizi
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(highlightedServices.length > 0
                  ? highlightedServices
                  : services.slice(0, 6)
                ).map((service) => (
                  <span
                    key={service}
                    className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm"
                  >
                    {service}
                  </span>
                ))}
                {services.length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    Inserisci i servizi chiave.
                  </span>
                )}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Cancellazione
              </p>
              <p className="mt-4 text-sm text-slate-600">{cancellationCopy}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Regole di casa
              </p>
              <p className="mt-4 text-sm text-slate-600">
                {houseRules ??
                  "Aggiungi le regole di casa per chiarire aspettative e orari."}
              </p>
            </div>
            <div
              id="contatti"
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Contatti
              </p>
              <div className="mt-4 space-y-3 text-sm">
                {hasContact ? (
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
                    Inserisci un referente per ricevere richieste dirette.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl space-y-8 px-6">
          <div className="space-y-2">
            <h2 className="font-display text-2xl md:text-3xl">FAQ</h2>
            <p className="text-sm text-slate-600">
              Risposte rapide per chi vuole prenotare.
            </p>
          </div>
          {faqItems.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {faqItems.map((faq) => (
                <details
                  key={faq.question}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
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
              Aggiungi le domande frequenti per ridurre i dubbi.
            </p>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-900 py-16 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_70%)]"
        />
        <div className="relative mx-auto max-w-5xl space-y-6 px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl">
            Pronto a vivere {info.name}?
          </h2>
          <p className="text-sm text-white/70">
            Richiedi disponibilita e ricevi una proposta personalizzata in
            giornata.
          </p>
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:opacity-90"
          >
            <a href="#contatti">Prenota ora</a>
          </Button>
        </div>
      </section>

      <StickyCta
        label="Richiedi disponibilita"
        href="#contatti"
        helper="Risposta entro 24 ore"
      />
    </div>
  );
}
