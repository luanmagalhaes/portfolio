import type { MetadataRoute } from "next";
import { localeTags, locales } from "@/domain/locale";
import { pagePath, versionIds, type PageId } from "@/lib/routes";
import { siteUrl } from "@/lib/site";

const pages: PageId[] = ["home", ...versionIds, "quick"];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${siteUrl}${pagePath(page, locale)}`,
      changeFrequency: "monthly" as const,
      priority: page === "home" ? 1 : 0.8,
      alternates: { languages: Object.fromEntries(locales.map((item) => [localeTags[item], `${siteUrl}${pagePath(page, item)}`])) },
    })),
  );
}
