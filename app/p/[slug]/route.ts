import {
  buildPropertyLandingHtml,
  defaultTemplateTheme,
} from "@/components/property/template-html";
import type { PropertyDetailsSchema } from "@/components/property/schema";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const normalizeSlug = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.endsWith(".html") ? trimmed.slice(0, -5) : trimmed;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const slug = normalizeSlug((await params).slug);
  if (!slug) {
    return new Response("Not Found", { status: 404 });
  }

  const { data, error } = await supabaseAdmin
    .from("property")
    .select("details, template")
    .eq("details->>slug", slug)
    .maybeSingle();

  if (error || !data?.details) {
    return new Response("Not Found", { status: 404 });
  }

  const template = data.template?.trim();
  const details = data.details as PropertyDetailsSchema;
  const html =
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
          faqs: details.faqs ?? [],
          landing: details.landing,
          theme: defaultTemplateTheme,
        });

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
