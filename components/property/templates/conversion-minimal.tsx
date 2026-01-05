import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import {
  COMFORT_KEYWORDS,
  EXTRA_KEYWORDS,
  KITCHEN_KEYWORDS,
  GalleryFallback,
  GalleryOverlay,
  StickyCta,
  categorizeServices,
  formatCapacity,
  getMicroUsp,
  getContactLines,
  getDescriptionParagraphs,
  getGalleryUrls,
  type PropertyTemplateProps,
} from "./shared";

export default function ConversionMinimalTemplate({
  info,
  services = [],
  gallery,
  position,
  contact,
  faqs,
}: PropertyTemplateProps) {
  const description = info.description?.trim();
  const excerpt =
    description && description.length > 160
      ? `${description.slice(0, 160)}...`
      : description ?? "Descrizione in arrivo. Aggiungi una breve panoramica.";
  const paragraphs = getDescriptionParagraphs(description, 3);
  const galleryUrls = getGalleryUrls(gallery);
  const galleryPreview = galleryUrls.slice(0, 6);
  const contactLines = getContactLines(contact);
  const houseRules = info.houseRules?.trim();
  const faqItems = faqs ?? [];
  const cancellationCopy =
    info.cancellationPolicy?.trim() ??
    "Politica flessibile: contattaci per personalizzare la cancellazione.";

  const groupedServices = categorizeServices(services, [
    { label: "Comfort", keywords: COMFORT_KEYWORDS },
    { label: "Cucina", keywords: KITCHEN_KEYWORDS },
    { label: "Extra", keywords: EXTRA_KEYWORDS },
  ]);

  return (
    <div className="bg-background text-foreground pb-24 md:pb-0">
      <section className="relative overflow-hidden border-b border-slate-100">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.2),_transparent_65%)]"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-14">
          <div className="grid items-start gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Conversion minimal
              </p>
              <p className="text-sm text-slate-500">
                {getMicroUsp(info, position, services)}
              </p>
              <h1 className="font-display text-3xl md:text-4xl">
                {info.name}
              </h1>
              <p className="text-sm text-slate-600">{excerpt}</p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <a href="#gallery">Guarda le foto</a>
                </Button>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Dettagli
              </p>
              <p className="mt-4 text-lg font-semibold text-slate-900">
                {formatCapacity(info)}
              </p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>Check-in flessibile su richiesta</p>
                <p>Assistenza dedicata in chat</p>
              </div>
              <Button asChild className="mt-6 w-full">
                <a href="#contatti">Richiedi disponibilita</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap gap-2">
            {services.length > 0 ? (
              services.slice(0, 8).map((service) => (
                <span
                  key={service}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
                >
                  {service}
                </span>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Inserisci i servizi principali per una panoramica rapida.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 py-12">
        <div className="mx-auto max-w-6xl space-y-8 px-6">
          <div className="space-y-2">
            <h2 className="font-display text-2xl md:text-3xl">
              Perche questa casa
            </h2>
            <p className="text-sm text-slate-600">
              Tre motivi chiari per scegliere questa soluzione.
            </p>
          </div>
          {paragraphs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {paragraphs.map((paragraph, index) => (
                <div
                  key={`${paragraph}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600"
                >
                  {paragraph}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Aggiungi una descrizione per valorizzare la proposta.
            </p>
          )}
        </div>
      </section>

      <section id="servizi" className="bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl space-y-8 px-6">
          <div className="space-y-2">
            <h2 className="font-display text-2xl md:text-3xl">Servizi</h2>
            <p className="text-sm text-slate-600">
              Servizi organizzati in categorie per una lettura immediata.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {groupedServices.map((group) => (
              <div
                key={group.label}
                className="rounded-3xl border border-slate-200 bg-white p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
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

      <section id="gallery" className="py-12">
        <div className="mx-auto max-w-6xl space-y-8 px-6">
          <div className="space-y-2">
            <h2 className="font-display text-2xl md:text-3xl">
              Gallery essenziale
            </h2>
            <p className="text-sm text-slate-600">
              Una selezione visiva per decidere subito.
            </p>
          </div>
          {galleryUrls.length > 0 ? (
            <GalleryOverlay
              images={galleryUrls}
              toggleId="conversion-minimal-modal"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {galleryPreview.map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt={`Gallery ${index + 1} di ${info.name}`}
                    className="h-56 w-full rounded-2xl object-cover"
                  />
                ))}
              </div>
            </GalleryOverlay>
          ) : (
            <GalleryFallback />
          )}
        </div>
      </section>

      <section
        id="posizione"
        className="border-t border-slate-100 py-12"
      >
        <div className="mx-auto max-w-6xl space-y-6 px-6">
          <div className="flex items-center gap-3 text-slate-600">
            <MapPin className="size-5" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em]">
              Dove si trova
            </p>
          </div>
          {position ? (
            <div className="space-y-2">
              <h3 className="font-display text-2xl">
                {position.city}, {position.country}
              </h3>
              <p className="text-sm text-slate-600">{position.address}</p>
              <p className="text-sm text-slate-600">
                Zona comoda per muoversi a piedi e con i servizi principali.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Posizione non ancora inserita. Aggiungi citta e indirizzo.
            </p>
          )}
        </div>
      </section>

      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl space-y-8 px-6">
          <div className="space-y-2">
            <h2 className="font-display text-2xl md:text-3xl">FAQ</h2>
            <p className="text-sm text-slate-600">
              Le risposte principali per decidere subito.
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
              Nessuna FAQ inserita. Aggiungi le risposte piu comuni.
            </p>
          )}
        </div>
      </section>

      <section id="fiducia" className="py-12">
        <div className="mx-auto max-w-6xl space-y-8 px-6">
          <div className="space-y-2">
            <h2 className="font-display text-2xl md:text-3xl">
              Cancellazione e contatti
            </h2>
            <p className="text-sm text-slate-600">
              Policy chiare e un contatto diretto per ogni richiesta.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Servizi chiave
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(services.length > 0 ? services.slice(0, 6) : []).map(
                  (service) => (
                    <span
                      key={service}
                      className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm"
                    >
                      {service}
                    </span>
                  )
                )}
                {services.length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    Inserisci i servizi principali.
                  </span>
                )}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Cancellazione
              </p>
              <p className="mt-4 text-sm text-slate-600">{cancellationCopy}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Regole di casa
              </p>
              <p className="mt-4 text-sm text-slate-600">
                {houseRules ??
                  "Inserisci le regole principali per evitare incomprensioni."}
              </p>
            </div>
            <div
              id="contatti"
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
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
                    Nessun contatto disponibile. Aggiungi email o telefono.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-900 py-16 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.2),_transparent_70%)]"
        />
        <div className="relative mx-auto max-w-5xl space-y-6 px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl">
            Prenota {info.name} in pochi clic
          </h2>
          <p className="text-sm text-white/70">
            Compila la richiesta e ricevi disponibilita e condizioni in
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
        helper="Contatto rapido"
      />
    </div>
  );
}
