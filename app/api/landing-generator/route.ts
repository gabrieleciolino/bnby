import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { getPropertyQuery } from "@/components/property/queries";
import {
  defaultTemplateTheme,
  templateFonts,
  templatePalettes,
} from "@/components/property/template-html";

const sanitizeHtml = (value: string) =>
  value.replace(/```html|```/gi, "").trim();

const buildPrompt = (input: {
  paletteId: string;
  layoutId: string;
  prompt?: string;
  property: Awaited<ReturnType<typeof getPropertyQuery>>;
}) => {
  const palette =
    templatePalettes.find((item) => item.id === input.paletteId) ??
    templatePalettes[0];
  const titleFont =
    templateFonts.find((item) => item.id === defaultTemplateTheme.fontTitle) ??
    templateFonts[0];
  const bodyFont =
    templateFonts.find((item) => item.id === defaultTemplateTheme.fontBody) ??
    templateFonts[0];
  const details = input.property?.details ?? {};
  const layoutDescriptions: Record<string, string> = {
    "modern-minimalist":
      "Landing Modern Minimalist: design pulito, ampi spazi bianchi, tipografia serif sofisticata per eleganza senza tempo.",
    "warm-boutique":
      "Landing Warm Boutique: accogliente, angoli smussati, ombre morbide e atmosfera intima da boutique hotel.",
    "editorial-bold":
      "Landing Editorial Bold: stile editoriale con contrasti netti, grandi titoli audaci e griglia asimmetrica da rivista di viaggi premium.",
  };
  const layoutHint =
    layoutDescriptions[input.layoutId] ??
    layoutDescriptions["modern-minimalist"];

  return `
Sei un web designer senior affiancato da un esperto SEO e copywriter. Genera un HTML completo (un solo file) per una landing page premium di una proprietà ricettiva, con forte impatto estetico.
Requisiti:
- Restituisci SOLO HTML, niente markdown o spiegazioni.
- Include CSS e JS inline (style/script) se necessari.
- Usa questi colori: ${JSON.stringify(palette.colors)}.
- Usa questi font: titolo "${titleFont.stack}", testo "${bodyFont.stack}".
- Mantieni le sezioni con id: descrizione, galleria, servizi, editorial, faq, posizione, contatti, footer.
- Includi una hero in alto con CTA verso contatti o prenotazioni.
- La galleria immagini deve aprire al click una versione full screen: navigabile con frecce e con thumbnail in basso; le thumbnail devono scorrere e restare sincronizzate con l'immagine attiva. Prevedi chiusura con ESC e click fuori.
- In galleria mostra al massimo 9 immagini; le altre devono essere accessibili tramite un pulsante "Mostra altre foto" posizionato sotto la griglia.
- Applica competenze SEO e di copywriting per curare i testi editoriali, headline, CTA e microcopy.
- Cura massima di tipografia, spaziature, gerarchia visiva e composizione. Evita layout generici.
- Aggiungi animazioni leggere e raffinate (on load, reveal on scroll, hover) e micro-interazioni coerenti con il layout scelto.
- Introduci effetti moderni e sobri (ombre morbide, gradienti leggeri, glassmorphism dove appropriato) senza esagerare.
- Usa icone di lucide.dev per i servizi (in SVG inline).
- Verifica che i contrasti cromatici garantiscano sempre la leggibilita di testi e CTA.
- Nel footer includi sempre la dicitura "Design by bnby.me".
- Includi sempre un language switcher funzionante con le versioni EN, ES, FR, DE della landing. Devi creare le traduzioni e il sito deve mostrare il contenuto nella lingua selezionata (senza dipendenze esterne).
- Layout selezionato: ${layoutHint}
- Usa tutte le info della proprietà qui sotto.

DATI PROPRIETA:
${JSON.stringify(details, null, 2)}

PROMPT UTENTE (opzionale):
${input.prompt?.trim() || "Nessun prompt aggiuntivo."}
  `.trim();
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const propertyId = String(body?.propertyId ?? "").trim();
    const paletteId = String(body?.paletteId ?? "").trim();
    const layoutId = String(body?.layoutId ?? "").trim();
    const prompt = typeof body?.prompt === "string" ? body.prompt : "";

    if (!propertyId) {
      return NextResponse.json(
        { error: "Missing propertyId" },
        { status: 400 }
      );
    }

    const property = await getPropertyQuery(propertyId);
    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: buildPrompt({
                paletteId,
                layoutId,
                prompt,
                property,
              }),
            },
          ],
        },
      ],
    });

    let rawHtml = "";
    if (typeof (response as { text?: unknown }).text === "function") {
      rawHtml = await (response as { text: () => Promise<string> }).text();
    } else if (typeof (response as { text?: unknown }).text === "string") {
      rawHtml = (response as { text: string }).text;
    } else if (
      typeof (response as { response?: { text?: () => Promise<string> } })
        .response?.text === "function"
    ) {
      rawHtml = await (
        response as { response: { text: () => Promise<string> } }
      ).response.text();
    }

    const html = sanitizeHtml(rawHtml);
    if (!html) {
      return NextResponse.json(
        { error: "Empty HTML from model" },
        { status: 500 }
      );
    }

    const landingId = randomUUID();
    const folder = path.join(process.cwd(), "public", "landing", propertyId);
    await fs.mkdir(folder, { recursive: true });
    const fileName = `${landingId}.html`;
    await fs.writeFile(path.join(folder, fileName), html, "utf-8");

    return NextResponse.json({
      url: `/landing/${propertyId}/${fileName}`,
      id: landingId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate landing" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const propertyId = url.searchParams.get("propertyId")?.trim();
  if (!propertyId) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }

  const folder = path.join(process.cwd(), "public", "landing", propertyId);
  try {
    const entries = await fs.readdir(folder);
    const items = await Promise.all(
      entries
        .filter((entry) => entry.endsWith(".html"))
        .map(async (entry) => {
          const stat = await fs.stat(path.join(folder, entry));
          return {
            url: `/landing/${propertyId}/${entry}`,
            filename: entry,
            createdAt: stat.mtime.toISOString(),
          };
        })
    );
    items.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
    return NextResponse.json({ items }, { status: 200 });
  } catch {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}
