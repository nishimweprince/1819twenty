import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://1819twenty.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/designers/apply/received", "/newsletter/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
