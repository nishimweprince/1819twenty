import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://1819twenty.com";
  return ["", "/about", "/designers", "/designers/apply", "/privacy", "/terms"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date("2026-09-18"),
    changeFrequency: path === "" ? "weekly" as const : "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
}
