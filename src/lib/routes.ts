import type { Locale } from "@/domain/locale";
import type { VersionId } from "@/domain/site";

export { versionIds, type VersionId } from "@/domain/site";

export type PageId = "home" | "quick" | VersionId;

const prefixes: Record<Locale, string> = { en: "", pt: "/pt" };

export function pagePath(page: PageId, locale: Locale): string {
  const prefix = prefixes[locale];

  if (page === "home") {
    return prefix || "/";
  }

  return `${prefix}/${page}`;
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "pt" : "en";
}
