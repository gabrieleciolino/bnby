import { z } from "zod";

const requestSchema = z.object({
  property: z.unknown().optional(),
});

const jsonResponse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function POST(request: Request) {
  let payload: z.infer<typeof requestSchema>;
  try {
    const body = await request.json();
    payload = requestSchema.parse(body);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Corpo della richiesta non valido";
    return jsonResponse({ error: message }, 400);
  }
  const property =
    payload.property && typeof payload.property === "object"
      ? payload.property
      : {};

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return jsonResponse({ error: "Configurazione AI mancante" }, 500);
  }

  const systemPrompt =
    "Sei un copywriter per strutture ricettive. Rispondi solo con JSON valido.";
  const userPrompt = [
    "Genera un singolo blocco editoriale per la landing.",
    "Il blocco deve avere un titolo e un testo in italiano.",
    "Il testo deve essere 2-4 frasi, tono elegante ma concreto.",
    "Se esistono gia altri blocchi, il nuovo deve essere diverso nei contenuti e non ripetitivo.",
    "Usa solo le informazioni presenti nel JSON della proprieta.",
    "Rispondi solo con JSON: {\"title\":\"...\",\"body\":\"...\"}.",
    "",
    "JSON proprieta:",
    JSON.stringify(property),
  ].join("\n");

  const aiResponse = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    }
  );

  if (!aiResponse.ok) {
    const errorText = await aiResponse.text();
    return jsonResponse(
      { error: errorText || "Generazione AI non riuscita" },
      500
    );
  }

  const aiData = await aiResponse.json().catch(() => null);
  const content = aiData?.choices?.[0]?.message?.content ?? "";
  let parsed: { title?: string; body?: string } | null = null;
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = null;
  }

  const title = parsed?.title?.trim() ?? "";
  const body = parsed?.body?.trim() ?? "";
  if (!title || !body) {
    return jsonResponse(
      { error: "Risposta AI non valida" },
      500
    );
  }

  return jsonResponse({ title, body }, 200);
}
