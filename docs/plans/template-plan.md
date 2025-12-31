# Plan

Uso create-plan per strutturare i passi per sviluppare un SaaS basato su
template curati, dati utente e pubblicazione statica autocontenuta su
filesystem locale con routing `/s/{slug}` e checkout Stripe. L'approccio e
costruire un content model unico, un editor per i dati e una pipeline di
publish dinamico che genera output statico senza rebuild.

## Scope
- In: schema dati standard, manifest template, template in codice, editor con
  preview, publish statico su filesystem locale, routing `/s/{slug}`, Stripe
  Checkout, upsell consulenza custom.
- Out: versioning/rollback, marketplace di template esterni, app mobile.

## Action items
[ ] Definire lo schema dati standard per le sezioni (hero, gallery, rooms,
    amenities, location, reviews, faq, cta, footer) in `lib/schema`.
[ ] Creare un manifest dei template (id, nome, sezioni, campi obbligatori,
    vincoli asset/testi) in `templates/`.
[ ] Implementare 2-3 template React con token di tema e props data-driven in
    `components/templates/`.
[ ] Costruire l'editor per i dati utente con validazione e preview live in
    `app/editor` (upload immagini, limiti testo, fallback).
[ ] Salvare i progetti utente (JSON + assets) in una struttura locale e
    definire il modello di storage per slug.
[ ] Implementare la pipeline "publish" che renderizza il template e genera
    HTML/CSS/JS/assets statici autocontenuti in una cartella separata,
    pubblicata in modo dinamico senza rebuild.
[ ] Configurare la route `/s/[slug]` per servire i siti pubblicati dalla
    cartella di output e gestire republish/overwrite in sicurezza.
[ ] Integrare Stripe Checkout per il piano "Template Launch 99 EUR" e
    sbloccare il publish a pagamento.
[ ] Validare con `pnpm build` e testare edge cases (slug duplicati, dati
    incompleti, immagini pesanti, publish concorrente).

## Open questions
- Nessuna al momento.
