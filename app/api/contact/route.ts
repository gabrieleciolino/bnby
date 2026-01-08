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
});

const jsonResponse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

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
  const resendFrom = process.env.RESEND_INFO_FROM;

  if (!resendApiKey || !resendFrom) {
    return jsonResponse({ error: "Configurazione email mancante" }, 500);
  }

  const baseUrl = new URL(request.url).origin;
  const contactLink = `${baseUrl}/dashboard/property/${payload.propertyId}/contacts`;
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
        contactLink,
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

  if (ownerUserId) {
    const { error: notificationError } = await supabaseAdmin
      .from("notification")
      .insert({
        user_id: ownerUserId,
        message: `Nuovo contatto da ${payload.name.trim()}`,
        link: `/dashboard/property/${payload.propertyId}/contacts`,
      });

    if (notificationError) {
      return jsonResponse(
        {
          error: notificationError.message || "Impossibile creare la notifica",
        },
        500
      );
    }
  }

  return jsonResponse(
    { message: "Messaggio inviato, ti risponderemo al più presto" },
    201
  );
}
