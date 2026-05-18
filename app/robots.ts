import type { MetadataRoute } from "next";
import { SCHOOL_DOMAIN } from "@/lib/school-config";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SCHOOL_DOMAIN;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/portal",
          "/portal/*",
          "/auth/*",
          "/api/*",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
