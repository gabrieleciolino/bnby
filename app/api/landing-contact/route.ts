import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

const jsonResponse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function POST(request: Request) {
  let payload: z.infer<typeof contactSchema>;
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Dati del contatto non validi";
      return jsonResponse({ error: message }, 400);
    }
    payload = parsed.data;
  } catch {
    return jsonResponse({ error: "Corpo della richiesta non valido" }, 400);
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM;

  if (!resendApiKey || !resendFrom) {
    return jsonResponse(
      { error: "Configurazione email mancante" },
      500
    );
  }

  const messageLines = [
    "Nuova richiesta dalla landing",
    "",
    `Nome: ${payload.name.trim()}`,
    `Email: ${payload.email.trim()}`,
    "",
    "Messaggio:",
    payload.message.trim(),
  ];

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendFrom,
      to: "gabriele.ciolino@gmail.com",
      subject: "Nuova richiesta dalla landing bnby.me",
      text: messageLines.join("\n"),
      reply_to: payload.email.trim(),
    }),
  });

  if (!resendResponse.ok) {
    const errorText = await resendResponse.text();
    return jsonResponse(
      { error: errorText || "Invio email non riuscito" },
      500
    );
  }

  return jsonResponse({ message: "Messaggio inviato" }, 201);
}
