import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  formStart: z.coerce.number().int().optional(),
  company: z.string().optional(),
  turnstileToken: z.string().optional(),
});

const jsonResponse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const MIN_FORM_SUBMIT_MS = 3000;
const MAX_URLS_BEFORE_STEP_UP = 1;

const extractClientIp = (request: Request) => {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;
  const forwarded = request.headers.get("x-forwarded-for");
  if (!forwarded) return null;
  return forwarded.split(",")[0]?.trim() || null;
};

const countLinks = (value: string) =>
  (value.match(/https?:\/\/\S+/gi) ?? []).length;

const verifyTurnstile = async (
  token: string,
  secret: string,
  ip?: string | null
) => {
  const params = new URLSearchParams({
    secret,
    response: token,
  });
  if (ip) {
    params.set("remoteip", ip);
  }
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    }
  );
  const data = (await response.json().catch(() => null)) as
    | { success?: boolean }
    | null;
  return Boolean(data?.success);
};

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

  if (payload.company?.trim()) {
    return jsonResponse({ error: "Richiesta non valida" }, 400);
  }

  const now = Date.now();
  const formStart = payload.formStart ?? null;
  const elapsedMs =
    typeof formStart === "number" && Number.isFinite(formStart)
      ? now - formStart
      : null;
  const tooFast = elapsedMs !== null ? elapsedMs < MIN_FORM_SUBMIT_MS : true;
  const hasManyLinks = countLinks(payload.message) > MAX_URLS_BEFORE_STEP_UP;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const isSuspicious = tooFast || hasManyLinks;
  const turnstileToken = payload.turnstileToken?.trim();

  if (isSuspicious && turnstileSecret && !turnstileToken) {
    return jsonResponse({ error: "captcha_required" }, 403);
  }

  if (turnstileToken) {
    if (!turnstileSecret) {
      return jsonResponse(
        { error: "Configurazione anti-spam mancante" },
        500
      );
    }
    const ok = await verifyTurnstile(
      turnstileToken,
      turnstileSecret,
      extractClientIp(request)
    );
    if (!ok) {
      return jsonResponse({ error: "Verifica anti-spam non riuscita" }, 403);
    }
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
