import type { MetadataRoute } from "next";

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

export default function robots(): MetadataRoute.Robots {
  const baseUrl = resolveBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/l/"],
        disallow: [
          "/authenticated/",
          "/auth/",
          "/api/",
          "/p/",
          "/admin/",
          "/dashboard/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
