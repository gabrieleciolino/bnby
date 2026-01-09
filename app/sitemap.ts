import type { MetadataRoute } from "next";

import { supabaseAdmin } from "@/lib/supabase/admin";
import type { PropertyDetailsSchema } from "@/components/property/schema";

const resolveBaseUrl = () => {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.VERCEL_URL;

  if (!envUrl) {
    return "http://localhost:3000";
  }

  return envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = resolveBaseUrl();
  const { data, error } = await supabaseAdmin
    .from("property")
    .select("details, updated_at")
    .eq("is_published", true);

  if (error || !data) {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
      },
    ];
  }

  const entries = data
    .map((row) => {
      const details = row.details as PropertyDetailsSchema;
      const slug = details?.slug?.trim();
      if (!slug) return null;
      return {
        url: `${baseUrl}/l/${slug}`,
        lastModified: row.updated_at ? new Date(row.updated_at) : new Date(),
      };
    })
    .filter(Boolean) as MetadataRoute.Sitemap;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...entries,
  ];
}
