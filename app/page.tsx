import { HousePlusIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f8fb] text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(125,214,255,0.55),transparent_65%)] blur-3xl" />
      <div className="pointer-events-none absolute top-10 right-[-160px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,211,160,0.7),transparent_70%)] blur-[90px] float-slow" />
      <div className="pointer-events-none absolute bottom-[-140px] left-[-120px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(123,244,213,0.6),transparent_70%)] blur-[100px] float-medium" />
      <div className="pointer-events-none absolute left-1/2 top-[20%] h-[180px] w-[180px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.85),transparent_70%)] blur-2xl pulse-glow" />

      <header className="relative z-10">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7cf2d2] via-[#7bb7ff] to-[#ffd6a2] shadow-[0_12px_30px_rgba(118,178,255,0.45)]">
              <HousePlusIcon className="font-display font-bold text-white text-lg " />
            </div>
            <div>
              <p className="font-display text-lg tracking-tight">BnBFacile</p>
              <p className="text-xs text-slate-500">
                Il sito del tuo BnB pronto in 15 minuti
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-8 text-sm text-slate-600 lg:flex">
            <a className="transition hover:text-slate-900" href="#features">
              Funzioni
            </a>
            <a className="transition hover:text-slate-900" href="#process">
              Come funziona
            </a>
            <a className="transition hover:text-slate-900" href="#work">
              Template
            </a>
            <a className="transition hover:text-slate-900" href="#pricing">
              Prezzi
            </a>
          </div>
          <a
            className="hidden items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5 hover:bg-slate-800 lg:inline-flex"
            href="#cta"
          >
            Consulenza custom
          </a>
        </nav>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-6xl px-6 pb-24 pt-4 lg:pt-12">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col gap-8">
              <span className="glass-card w-fit rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 fade-up">
                Template curati per BnB
              </span>
              <div className="flex flex-col gap-6">
                <h1 className="font-display text-4xl leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  Il sito del tuo BnB pronto in 60 minuti, da 99 EUR.
                </h1>
                <p className="text-lg text-slate-600">
                  Scegli un template di livello studio, personalizza con il
                  nostro editor no-code e pubblica con booking form e pagamenti
                  gia pronti.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  className="shimmer inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#111827] via-[#1f2937] to-[#0f172a] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(15,23,42,0.35)] transition hover:-translate-y-0.5"
                  href="#pricing"
                >
                  Attiva il piano 99 EUR
                </a>
                <a
                  className="glass-card inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5"
                  href="#work"
                >
                  Esplora i template
                </a>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="glass-card rounded-2xl px-5 py-4 transition hover:-translate-y-1">
                  <p className="font-display text-2xl text-slate-900">18</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Template premium
                  </p>
                </div>
                <div className="glass-card rounded-2xl px-5 py-4 transition hover:-translate-y-1">
                  <p className="font-display text-2xl text-slate-900">60 min</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Sito online
                  </p>
                </div>
                <div className="glass-card rounded-2xl px-5 py-4 transition hover:-translate-y-1">
                  <p className="font-display text-2xl text-slate-900">24/7</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Supporto reale
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="glass-card-strong rounded-[32px] p-6 shadow-[0_30px_80px_rgba(15,23,42,0.2)] transition hover:-translate-y-1">
                <div className="flex items-center justify-between pb-4 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-400" />
                    <span className="h-2 w-2 rounded-full bg-amber-300" />
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  </div>
                  <span>bnbfacile.app</span>
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1f2937] to-[#0b1f3b] p-6 text-white">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                    Template: Suite Lago
                  </p>
                  <h2 className="mt-3 font-display text-2xl leading-tight">
                    Hero con gallery full-screen,
                    <br /> mappa e booking integrato.
                  </h2>
                  <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm">
                    <span>Setup in 1 click</span>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
                      Preview live
                    </span>
                  </div>
                </div>
                <div className="mt-6 grid gap-3">
                  <div className="glass-outline flex items-center justify-between rounded-2xl bg-white/60 px-4 py-3 text-sm text-slate-700">
                    <span>Widget prenotazioni</span>
                    <span className="font-semibold text-emerald-600">
                      Attivo
                    </span>
                  </div>
                  <div className="glass-outline flex items-center justify-between rounded-2xl bg-white/60 px-4 py-3 text-sm text-slate-700">
                    <span>Libreria template</span>
                    <span className="font-semibold text-emerald-600">
                      Online
                    </span>
                  </div>
                </div>
              </div>
              <div className="glass-card absolute -bottom-8 -left-6 hidden w-44 rounded-2xl px-4 py-3 text-xs text-slate-600 shadow-[0_20px_60px_rgba(15,23,42,0.2)] lg:block float-medium">
                <p className="font-semibold text-slate-900">Template scelto</p>
                <p className="mt-2 text-2xl font-display text-slate-900">
                  Riviera
                </p>
                <p className="text-xs text-emerald-600">Pronto da usare</p>
              </div>
              <div className="glass-card absolute -top-10 right-6 hidden rounded-2xl px-4 py-3 text-xs text-slate-600 shadow-[0_20px_60px_rgba(15,23,42,0.2)] lg:block float-fast">
                <p className="font-semibold text-slate-900">Editor no-code</p>
                <p className="mt-1 text-sm">Drag, drop, pubblica</p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                Tutto incluso
              </p>
              <h2 className="font-display mt-4 text-3xl text-slate-900 md:text-4xl">
                Una piattaforma SaaS che fa tutto il lavoro pesante.
              </h2>
            </div>
            <p className="max-w-md text-sm text-slate-600">
              Template curati, editor semplice e strumenti di conversione
              pronti, cosi puoi lanciare subito.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Template di livello studio",
                text: "Layout pensati per BnB, ottimizzati per mobile e conversioni.",
              },
              {
                title: "Editor no-code",
                text: "Personalizza testi, foto e sezioni senza toccare codice.",
              },
              {
                title: "Booking form + pagamenti",
                text: "Collega il tuo channel manager o usa il modulo integrato.",
              },
              {
                title: "SEO locale guidata",
                text: "Schema, meta tag e pagine ottimizzate per farti trovare.",
              },
              {
                title: "Hosting veloce + SSL",
                text: "Sicurezza e performance gia attive, senza pensieri.",
              },
              {
                title: "Insight in tempo reale",
                text: "Dashboard con visite, click e richieste di prenotazione.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="glass-card group rounded-3xl p-6 transition hover:-translate-y-2"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7cf2d2] via-[#7bb7ff] to-[#ffd6a2] text-slate-900 shadow-[0_12px_30px_rgba(118,178,255,0.45)] transition group-hover:scale-105">
                  <span className="font-display text-lg">+</span>
                </div>
                <h3 className="font-display text-xl text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm text-slate-600">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="process" className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                Come funziona
              </p>
              <h2 className="font-display mt-4 text-3xl text-slate-900 md:text-4xl">
                Dalla scelta del template al sito live in un pomeriggio.
              </h2>
              <p className="mt-4 text-sm text-slate-600">
                Nessun brief infinito: scegli, personalizza, pubblica. Se vuoi
                andare oltre, il nostro team ti segue in consulenza.
              </p>
            </div>
            <div className="grid gap-4">
              {[
                {
                  step: "01",
                  title: "Scegli il template",
                  text: "Seleziona lo stile perfetto per la tua struttura.",
                },
                {
                  step: "02",
                  title: "Personalizza in editor",
                  text: "Carica foto, aggiorna testi, imposta prezzi e CTA.",
                },
                {
                  step: "03",
                  title: "Collega strumenti",
                  text: "Pagamenti, calendario, channel manager e analytics.",
                },
                {
                  step: "04",
                  title: "Pubblica e migliora",
                  text: "Vai online, misura i risultati e scala con il custom.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="glass-card flex flex-col gap-3 rounded-3xl px-6 py-5 transition hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-display text-xl text-slate-900">
                      {item.step}
                    </span>
                    <span className="h-px flex-1 bg-slate-200" />
                  </div>
                  <h3 className="font-display text-xl text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                Template curati
              </p>
              <h2 className="font-display mt-4 text-3xl text-slate-900 md:text-4xl">
                Scegli tra collezioni create per BnB di ogni stile.
              </h2>
            </div>
            <p className="max-w-md text-sm text-slate-600">
              Ogni template e pronto per foto, servizi, mappa e booking, con
              sezioni che puoi attivare in un click.
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                name: "Riviera",
                tag: "Coastal BnB",
                color: "from-[#0f172a] via-[#1e3a8a] to-[#0f172a]",
              },
              {
                name: "Corte",
                tag: "Historic House",
                color: "from-[#111827] via-[#334155] to-[#1f2937]",
              },
              {
                name: "Urban Loft",
                tag: "City Rooms",
                color: "from-[#0b3b5a] via-[#0f4c81] to-[#0b3b5a]",
              },
            ].map((project) => (
              <div
                key={project.name}
                className="glass-card group rounded-[28px] p-6 transition hover:-translate-y-2"
              >
                <div
                  className={`shimmer rounded-3xl bg-gradient-to-br ${project.color} px-5 py-10 text-white shadow-[0_20px_50px_rgba(15,23,42,0.35)]`}
                >
                  <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                    {project.tag}
                  </p>
                  <h3 className="mt-4 font-display text-2xl">{project.name}</h3>
                  <div className="mt-10 flex items-center justify-between text-xs text-white/70">
                    <span>Template + CMS</span>
                    <span>Preview</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
                  <span>Setup rapido</span>
                  <span className="text-slate-900">Apri</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                Prezzi
              </p>
              <h2 className="font-display mt-4 text-3xl text-slate-900 md:text-4xl">
                Parti da 99 EUR, poi passa al custom quando vuoi.
              </h2>
            </div>
            <p className="max-w-md text-sm text-slate-600">
              Il piano template ti mette online subito. Se vuoi un progetto
              unico, prenota la consulenza e costruiamo tutto da zero.
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {[
              {
                name: "Template Launch",
                price: "99 EUR",
                desc: "Accesso ai template curati con tutto pronto.",
                cta: "Attiva ora",
                href: "mailto:ciao@bnbfacile.it",
                features: [
                  "Template premium illimitati",
                  "Editor no-code",
                  "Hosting + SSL",
                  "Booking form base",
                ],
              },
              {
                name: "Consulenza Custom",
                price: "Da 790 EUR",
                desc: "Progetto su misura con strategia e design dedicato.",
                cta: "Prenota consulenza",
                href: "#cta",
                features: [
                  "Workshop strategico",
                  "Design e copy personalizzati",
                  "Automazioni e integrazioni",
                  "Supporto premium",
                ],
                highlight: true,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-[28px] p-6 transition hover:-translate-y-2 ${
                  plan.highlight
                    ? "bg-gradient-to-br from-[#0f172a] via-[#1f2937] to-[#0b1220] text-white shadow-[0_25px_70px_rgba(15,23,42,0.35)]"
                    : "glass-card text-slate-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl">{plan.name}</h3>
                  {plan.highlight ? (
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-[0.3em]">
                      Best
                    </span>
                  ) : null}
                </div>
                <p
                  className={`mt-4 text-3xl font-display ${
                    plan.highlight ? "text-white" : "text-slate-900"
                  }`}
                >
                  {plan.price}
                </p>
                <p
                  className={`mt-2 text-sm ${
                    plan.highlight ? "text-white/70" : "text-slate-600"
                  }`}
                >
                  {plan.desc}
                </p>
                <div className="mt-6 flex flex-col gap-2 text-sm">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          plan.highlight ? "bg-emerald-300" : "bg-emerald-500"
                        }`}
                      />
                      <span
                        className={
                          plan.highlight ? "text-white/80" : "text-slate-600"
                        }
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                <a
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
                    plan.highlight
                      ? "bg-white text-slate-900 hover:bg-white/90"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                  href={plan.href}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </section>

        <section id="cta" className="mx-auto max-w-6xl px-6 pb-24 pt-10">
          <div className="glass-card-strong relative overflow-hidden rounded-[36px] px-6 py-12 text-center md:px-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,242,210,0.4),transparent_60%)] opacity-70" />
            <div className="pointer-events-none absolute -right-10 top-0 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,rgba(123,183,255,0.6),transparent_70%)] blur-2xl float-slow" />
            <div className="relative flex flex-col items-center gap-6">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                Vuoi qualcosa di davvero tuo?
              </p>
              <h2 className="font-display text-3xl text-slate-900 md:text-4xl">
                Vai oltre i template con una consulenza custom.
              </h2>
              <p className="max-w-2xl text-sm text-slate-600">
                In 45 minuti analizziamo il tuo BnB e costruiamo un piano su
                misura: posizionamento, design, contenuti e conversioni.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  className="shimmer inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#111827] via-[#1f2937] to-[#0f172a] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(15,23,42,0.35)] transition hover:-translate-y-0.5"
                  href="mailto:ciao@bnbfacile.it"
                >
                  Prenota consulenza custom
                </a>
                <a
                  className="glass-card inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5"
                  href="#pricing"
                >
                  Parti da 99 EUR
                </a>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-[0.3em] text-slate-500">
                <span>Strategia su misura</span>
                <span>Design esclusivo</span>
                <span>Supporto premium</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/70 bg-white/40 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 text-sm text-slate-600 md:flex-row md:items-center">
          <div>
            <p className="font-display text-lg text-slate-900">BnBFacile</p>
            <p className="mt-2 text-xs text-slate-500">
              Template curati e consulenze custom per BnB.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.3em]">
            <a className="transition hover:text-slate-900" href="#features">
              Funzioni
            </a>
            <a className="transition hover:text-slate-900" href="#process">
              Come funziona
            </a>
            <a className="transition hover:text-slate-900" href="#pricing">
              Prezzi
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
