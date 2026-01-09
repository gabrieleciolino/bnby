import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PropertyDetailsSchema } from "@/components/property/schema";
import { renderNewContactOwnerEmail } from "@/lib/email/new-contact-owner";

const contactPayloadSchema = z.object({
  propertyId: z.string().uuid(),
  name: z.string().min(1),
  message: z.string().min(1),
  email: z.string().optional(),
  phone: z.string().optional(),
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
  const data = (await response.json().catch(() => null)) as {
    success?: boolean;
  } | null;
  return Boolean(data?.success);
};

export async function POST(request: Request) {
  let payload: z.infer<typeof contactPayloadSchema>;
  try {
    const body = await request.json();
    const parsed = contactPayloadSchema.safeParse(body);
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
      return jsonResponse({ error: "Configurazione anti-spam mancante" }, 500);
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

  const emailValue = payload.email?.trim() ?? "";
  const phoneValue = payload.phone?.trim() ?? "";
  if (!emailValue && !phoneValue) {
    return jsonResponse(
      { error: "Inserisci un indirizzo email o un telefono per il contatto" },
      400
    );
  }

  const { data: existingProperty, error: propertyError } = await supabaseAdmin
    .from("property")
    .select("id,user_id,details")
    .eq("id", payload.propertyId)
    .maybeSingle();

  if (propertyError || !existingProperty) {
    return jsonResponse(
      { error: "Proprietà non trovata o non disponibile" },
      404
    );
  }

  const propertyDetails = existingProperty?.details as
    | PropertyDetailsSchema
    | null
    | undefined;
  const propertyName = propertyDetails?.info?.name ?? "Proprietà";

  const { error: insertError } = await supabaseAdmin.from("contact").insert({
    property_id: payload.propertyId,
    name: payload.name.trim(),
    email: emailValue || null,
    phone: phoneValue || null,
    message: payload.message.trim(),
  });

  if (insertError) {
    return jsonResponse(
      { error: insertError.message || "Impossibile salvare il messaggio" },
      500
    );
  }

  const ownerUserId = existingProperty?.user_id ?? null;
  const fallbackEmail = propertyDetails?.contact?.email?.trim() || null;
  let ownerEmail = fallbackEmail;

  if (ownerUserId) {
    const { data: ownerData, error: ownerError } =
      await supabaseAdmin.auth.admin.getUserById(ownerUserId);

    if (ownerError) {
      return jsonResponse(
        {
          error: ownerError.message || "Impossibile recuperare il proprietario",
        },
        500
      );
    }

    ownerEmail = ownerData?.user?.email ?? fallbackEmail;
  }

  if (!ownerEmail) {
    return jsonResponse({ error: "Email proprietario non disponibile" }, 500);
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.NEXT_PUBLIC_RESEND_INFO_FROM;

  if (!resendApiKey || !resendFrom) {
    return jsonResponse({ error: "Configurazione email mancante" }, 500);
  }

  const baseUrl = new URL(request.url).origin;
  const messageLines = [
    `Nuovo contatto per ${propertyName}`,
    "",
    `Nome: ${payload.name.trim()}`,
    emailValue ? `Email: ${emailValue}` : null,
    phoneValue ? `Telefono: ${phoneValue}` : null,
    "",
    "Messaggio:",
    payload.message.trim(),
  ].filter(Boolean);

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendFrom,
      to: ownerEmail,
      subject: `Nuovo contatto: ${propertyName}`,
      html: renderNewContactOwnerEmail({
        baseUrl,
        propertyName,
        contactName: payload.name.trim(),
        contactEmail: emailValue || null,
        contactPhone: phoneValue || null,
        message: payload.message.trim(),
        contactLink: null,
      }),
      text: messageLines.join("\n"),
      reply_to: emailValue || undefined,
    }),
  });

  if (!resendResponse.ok) {
    const errorText = await resendResponse.text();
    return jsonResponse(
      { error: errorText || "Invio email non riuscito" },
      500
    );
  }

  return jsonResponse(
    { message: "Messaggio inviato, ti risponderemo al più presto" },
    201
  );
}
