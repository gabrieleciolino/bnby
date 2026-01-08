import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Headset,
  MailCheck,
  Sparkles,
} from "lucide-react";

import { LandingContactForm } from "@/components/public/landing-contact-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden pt-8 pb-20 lg:pt-16 lg:pb-28">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute -top-20 right-0 size-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 size-64 rounded-full bg-secondary/20 blur-3xl" />

        <div className="main-container relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="fade-up space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-semibold shadow-sm">
              <Sparkles className="size-4 text-primary" />
              Sito pronto in pochi minuti
            </div>
            <h1 className="text-4xl font-display font-bold leading-tight md:text-5xl lg:text-6xl">
              Il tuo BnB merita un sito{" "}
              <span className="font-display italic text-primary">
                bello e funzionale.
              </span>
            </h1>
            <p className="text-base text-muted-foreground md:text-lg">
              bnby.me crea una landing elegante, sincronizza il calendario e
              raccoglie le richieste in un pannello unico. Semplifica la
              gestione della tua struttura.
            </p>
            <div className="flex flex-col gap-3 text-sm font-medium text-muted-foreground sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                Nessuna carta di credito
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                Supporto dedicato
              </div>
            </div>
          </div>

          <div className="fade-up relative">
            <div className="absolute top-0 right-0 size-72 rounded-full bg-secondary/20 blur-3xl" />
            <div className="absolute bottom-0 left-10 size-56 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative rounded-3xl border border-border bg-card/90 p-4 shadow-xl transition-transform duration-500 lg:rotate-1 lg:hover:rotate-0">
              <div className="rounded-2xl border border-dashed border-border/60 bg-background/70 p-6 shadow-sm">
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Preview sito
                  </span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="size-2 rounded-full bg-primary" />
                    Live
                  </div>
                </div>
                <div className="rounded-xl bg-gradient-to-b from-primary/20 to-transparent p-6">
                  <div className="mb-3 h-4 w-32 rounded-full bg-primary/30" />
                  <div className="h-32 rounded-lg border border-white/30 bg-white/70 shadow-sm" />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="h-20 rounded-xl bg-muted/60" />
                  <div className="h-20 rounded-xl bg-muted/60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card/50 py-16">
        <div className="main-container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl font-display font-bold md:text-4xl">
              Tutto quello che serve per vendere di piu
            </h2>
            <p className="text-muted-foreground">
              Un percorso semplice, curato nei dettagli e ottimizzato per
              convertire. Abbiamo pensato a tutto noi.
            </p>
            <div className="space-y-4">
              {[
                "Template eleganti e pronti all'uso",
                "Richieste e contatti ordinati in un unico pannello",
                "Calendario sincronizzato con Airbnb e Booking",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-sm"
                >
                  <CheckCircle2 className="size-5 text-primary" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Sito personalizzato",
                description: "Colori, foto e contenuti su misura.",
                icon: Globe,
              },
              {
                title: "Inbox ordinata",
                description: "Contatti e richieste nello stesso posto.",
                icon: MailCheck,
              },
              {
                title: "Assistenza umana",
                description: "Ti seguiamo fino alla pubblicazione.",
                icon: Headset,
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-transparent bg-card p-6 shadow-sm transition-colors hover:border-primary/20"
              >
                <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-background text-primary">
                  <card.icon className="size-5" />
                </div>
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="py-20">
        <div className="main-container">
          <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#E2655E_0%,#5EADC6_100%)] px-6 py-12 text-white md:px-12 lg:px-16">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none" />
            <div className="relative z-10 grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-display font-bold md:text-4xl">
                  Vuoi capire se bnby.me e adatto alla tua struttura?
                </h2>
                <p className="text-lg text-white/90">
                  Compila il form e ti inviamo una demo personalizzata con
                  anteprima del tuo sito. Nessun impegno.
                </p>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <ArrowRight className="size-4" />
                  Ti rispondiamo entro 24 ore.
                </div>
              </div>
              <div className="rounded-2xl bg-white/95 p-6 text-foreground shadow-xl">
                <LandingContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card/60 py-10">
        <div className="main-container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <span className="font-semibold text-foreground">bnby</span>
          <span>© 2024 bnby.me. Tutti i diritti riservati.</span>
        </div>
      </footer>
    </div>
  );
}
