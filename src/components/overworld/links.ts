import { localeTags, type Locale } from "@/domain/locale";
import { otherLocale, pagePath } from "@/lib/routes";

export interface OverworldLinks {
  home: string;
  quick: string;
  other: string;
  otherLang: string;
}

export function overworldLinks(locale: Locale): OverworldLinks {
  const other = otherLocale(locale);
  return { home: pagePath("home", locale), quick: pagePath("quick", locale), other: pagePath("overworld", other), otherLang: localeTags[other] };
}
