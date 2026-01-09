import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Globe,
  Headset,
  MailCheck,
  Sparkles,
  Check,
  Star,
} from "lucide-react";

import { LandingContactForm } from "@/components/landing/landing-contact-form";
import CustomIcon from "@/components/common/custom-icon";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden pt-8 pb-20 lg:pt-16 lg:pb-28">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute -top-20 right-0 size-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 size-64 rounded-full bg-secondary/20 blur-3xl" />

        <div className="main-container relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="fade-up space-y-8">
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

      <section className="py-24 bg-white/50 dark:bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-display">
              Tutto quello che ti serve per far esplodere le tue prenotazioni
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Strumenti professionali progettati per dare controllo totale sulla
              tua attività e scalare la tua presenza digitale.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="pillar-card bg-card rounded-3xl p-8 shadow-soft border border-gray-100 dark:border-gray-800 flex flex-col group hover:border-primary/30 transition-all duration-300">
              <div className="mb-10 relative">
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20"></div>
                    <div className="space-y-1 flex-1">
                      <div className="h-2 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-1.5 w-12 bg-gray-100 dark:bg-gray-800 rounded"></div>
                    </div>
                    <span className="material-symbols-outlined text-green-500 text-sm">
                      verified
                    </span>
                  </div>
                  <div className="h-32 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                      Premium Identity
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Più professionale
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Comunica affidabilità con un'identità di brand premium. Non
                essere solo una stanza su un portale, ma una destinazione con un
                carattere unico e affidabile.
              </p>
              <ul className="space-y-2 mt-auto">
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <Check />
                  Design curato
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <Check />
                  Badge di fiducia
                </li>
              </ul>
            </div>
            <div className="pillar-card bg-card rounded-3xl p-8 shadow-soft border border-gray-100 dark:border-gray-800 flex flex-col group hover:border-secondary/30 transition-all duration-300">
              <div className="mb-10">
                <div className="relative bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm text-xs font-mono text-secondary truncate mb-4">
                    bnby.me/la-tua-villa
                  </div>
                  <div className="flex justify-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg">
                      <CustomIcon
                        icon="facebook"
                        className="size-8 fill-white"
                      />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 flex items-center justify-center text-white text-lg">
                      <CustomIcon
                        icon="instagram"
                        className="size-8 fill-white"
                      />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#46E460] flex items-center justify-center text-white text-lg">
                      <CustomIcon
                        icon="whatsapp"
                        className="size-8 fill-white"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      Traffico diretto &amp; Ads
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Più raggiungibile
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Ottieni il tuo link indipendente da condividere ovunque: nei
                tuoi profili social, nelle inserzioni e direttamente ai tuoi
                ospiti via WhatsApp.
              </p>
              <ul className="space-y-2 mt-auto">
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <Check />
                  URL Personalizzato
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <Check />
                  Social Ready
                </li>
              </ul>
            </div>
            <div className="pillar-card bg-card rounded-3xl p-8 shadow-soft border border-gray-100 dark:border-gray-800 flex flex-col group hover:border-orange-400/30 transition-all duration-300">
              <div className="mb-10">
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="h-10 bg-white dark:bg-gray-800 rounded-md border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-xs text-gray-300">
                        image
                      </span>
                    </div>
                    <div className="h-10 bg-primary/20 rounded-md flex items-center justify-center transform -translate-y-1">
                      <span className="material-symbols-outlined text-xs text-primary">
                        touch_app
                      </span>
                    </div>
                  </div>
                  <div className="h-16 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-2 flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-2 w-16 bg-gray-100 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Completamente personalizzabile
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Editor intuitivo senza codice. Trascina gli elementi, cambia i
                colori e carica le foto in pochi clic per creare il sito
                esattamente come lo desideri.
              </p>
              <ul className="space-y-2 mt-auto">
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <Check />
                  Drag &amp; Drop
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-500">
                  <Check />
                  Zero Technical Skills
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background-light dark:bg-background-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white font-display">
              Cosa dicono di noi
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Proprietari di BnB che hanno già trasformato la loro presenza
              online con bnby.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-800 flex flex-col h-full hover:-translate-y-1 transition-transform">
              <div className="flex gap-1 text-primary mb-6">
                <Star className="fill-primary/50" />
                <Star className="fill-primary/50" />
                <Star className="fill-primary/50" />
                <Star className="fill-primary/50" />
                <Star className="fill-primary/50" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic mb-8 flex-grow">
                "Il sito è stato pronto in meno di un’ora. Finalmente ho una
                vetrina professionale che non mi costa una fortuna ogni mese."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <img
                    alt="Marco Rossi"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBG7Ri4gBL0WPGIHvbgapPUX7injjkYJ9y3_nkQPr6NLXrA0H_DGFySTWinGSPtYs7XfUzYZXkrn4BzJ71Sa-cD_voUTGZ55gGM-cOfJ9wyyDB3o1-K8whR_N4GywgPXBd8zhJPD_Z-m0hZpmVreKaB1iCJE6Lyt1We0IbWmXAqXaa0-nWEyV_Bn0P_Z9PIweJWBTwJLQDNGA7EOr9C1gQ6FtgWMTS7_xPQGGyWIdI9zPQuEF_NNAmY9DN8MG7FzQhHM0m6c-kDCinv"
                  />
                </div>
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    Marco Pingitore
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Villa Aurora, Toscana
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-800 flex flex-col h-full hover:-translate-y-1 transition-transform">
              <div className="flex gap-1 text-primary mb-6">
                <Star className="fill-primary/50" />
                <Star className="fill-primary/50" />
                <Star className="fill-primary/50" />
                <Star className="fill-primary/50" />
                <Star className="fill-primary/50" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic mb-8 flex-grow">
                "La sincronizzazione del calendario è impeccabile. Non ho più
                avuto problemi di overbooking da quando uso bnby."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <img
                    alt="Luca Bianchi"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGHvIGNgY-W5kUMdoon1AAqXFJm_v-MB5A6SewE818ZYcSINyO7xX4yQ5Tj3uKzI6l5_s6YfToMY8nmTBOX64_U4lLn_3ewg7JVJ9Wa0hGq0aaWkezXHRGYmYXw9hMKKOwjEwT6pULw911tYnUNLEWwYOM8dbBTLyPar6Fr7l6jPFBBsxzCyI5sMZtyzanmigN9EjlzUVBZEKrf32zh5JcloHKjvLtmaoQAgXBoq7QhaEULL_16tvjYNSOu1OPP-tDo4joS3-FvcAT"
                  />
                </div>
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    Elia Scanzi
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    B&amp;B La Lanterna, Genova
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-800 flex flex-col h-full hover:-translate-y-1 transition-transform">
              <div className="flex gap-1 text-primary mb-6">
                <Star className="fill-primary/50" />
                <Star className="fill-primary/50" />
                <Star className="fill-primary/50" />
                <Star className="fill-primary/50" />
                <Star className="fill-primary/50" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic mb-8 flex-grow">
                "Un'assistenza fantastica. Mi hanno aiutato a configurare tutto
                passo dopo passo. Molto soddisfatta del risultato."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <img
                    alt="Elena Verdi"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc3NsJ7p3Lt5B4HGUwdHzXnIWqr92BPrvQlWjRnhOAilLNOLNx2jTaJdTEosQe68PG07MkXalAoXplG6pLE--LWFfNca9wG9vM2yzokSEy3bStp9C3pF5OhIx89hh8SuxRsiscKl0Oah1Xb5CRPiSODqI62FELbAQ_ypR11_spFsV_wDhUEcJMeRlKfL2oA6kzq0IzXmn8lNNoDpFN4-mPIjwGZMhELPK73YKdkInAdQedO4wK_ByydRHLXexrdh-Ds_8NyIB1Gjwx"
                  />
                </div>
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    Elena Rametti
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sweet Home, Roma
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white/30 dark:bg-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white font-display">
              Domande Frequenti
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Tutto quello che devi sapere per iniziare con il piede giusto.
            </p>
          </div>
          <div className="space-y-4">
            <details className="group bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card">
              <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                <span className="font-bold text-gray-900 dark:text-white text-lg">
                  Ho già Airbnb/Booking. A cosa mi serve una landing?
                </span>
                <span className="faq-icon material-icons-round text-gray-400 transition-transform duration-300">
                  <ChevronDown />
                </span>
              </summary>
              <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                Perché ti serve un link tuo: da mettere su Instagram, WhatsApp,
                Google e ads. Airbnb/Booking sono ottimi per le prenotazioni, ma
                non sono pensati come “vetrina” da condividere e controllare.
              </div>
            </details>
            <details className="group bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card">
              <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                <span className="font-bold text-gray-900 dark:text-white text-lg">
                  Non sono pratico di tecnologia.
                </span>
                <span className="faq-icon material-icons-round text-gray-400 transition-transform duration-300">
                  <ChevronDown />
                </span>
              </summary>
              <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                Non serve. Dal pannello modifichi testi, foto e sezioni con
                pochi click. Se preferisci, puoi lasciare tutto com’è e usare
                solo il link.
              </div>
            </details>
            <details className="group bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card">
              <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                <span className="font-bold text-gray-900 dark:text-white text-lg">
                  Quanto tempo mi porta via?
                </span>
                <span className="faq-icon material-icons-round text-gray-400 transition-transform duration-300">
                  <ChevronDown />
                </span>
              </summary>
              <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                Praticamente zero: la landing è già pronta e online. Se vuoi
                aggiornarla, lo fai in 2 minuti (foto, servizi, contatti, link
                prenotazione).
              </div>
            </details>
            <details className="group bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card">
              <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                <span className="font-bold text-gray-900 dark:text-white text-lg">
                  E se non mi serve più?
                </span>
                <span className="faq-icon material-icons-round text-gray-400 transition-transform duration-300">
                  <ChevronDown />
                </span>
              </summary>
              <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                Nessun vincolo: paghi annualmente e puoi scegliere di non
                rinnovare. Alla scadenza, la pagina viene disattivata.
              </div>
            </details>
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
