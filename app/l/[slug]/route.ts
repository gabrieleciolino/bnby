import {
  buildPropertyLandingHtml,
  defaultTemplateTheme,
} from "@/components/property/template-html";
import type { PropertyDetailsSchema } from "@/components/property/schema";
import { extractUnavailableDatesFromIcal } from "@/lib/booking/ical";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = (await params).slug.trim();
  if (!slug) {
    return new Response("Not Found", { status: 404 });
  }

  const { data, error } = await supabaseAdmin
    .from("property")
    .select("id, details, template, is_published")
    .eq("details->>slug", slug)
    .maybeSingle();

  if (error || !data?.details || !data.is_published) {
    return new Response("Not Found", { status: 404 });
  }

  const details = data.details as PropertyDetailsSchema;
  const bookingIcalUrl = details.booking?.icalUrl?.trim();
  const bookingAvailability = bookingIcalUrl
    ? await (async () => {
        try {
          const response = await fetch(bookingIcalUrl, {
            headers: { "User-Agent": "bnbfacile-calendar" },
            cache: "no-store",
          });
          if (!response.ok) {
            return null;
          }

          const icalText = await response.text();
          const unavailableDates = extractUnavailableDatesFromIcal(icalText);
          return { unavailableDates };
        } catch {
          return null;
        }
      })()
    : null;

  const template = data.template?.trim();
  const htmlBase =
    template && template.length > 0
      ? template
      : buildPropertyLandingHtml({
          info: details.info,
          services: details.services ?? [],
          gallery: (details.gallery ?? [])
            .filter((item): item is string => typeof item === "string")
            .map((url, index) => ({
              url,
              alt: url.split("/").pop() ?? `image-${index + 1}`,
            })),
          position: details.position,
          contact: details.contact,
          booking: details.booking,
          faqs: details.faqs ?? [],
          landing: details.landing,
          bookingAvailability,
          theme: defaultTemplateTheme,
          propertyId: data.id,
        });

  const html =
    template && template.length > 0 && bookingAvailability
      ? htmlBase.replace(
          /<script type="application\/json" id="booking-data">[\s\S]*?<\/script>/,
          `<script type="application/json" id="booking-data">${JSON.stringify(
            bookingAvailability
          ).replace(/</g, "\\u003c")}</script>`
        )
      : htmlBase;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
