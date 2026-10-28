import { resolveLocale, type Locale, type Resolved } from "@/domain/locale";
import type { PortfolioContent, PortfolioSource } from "@/domain/portfolio";

export type Portfolio = Resolved<PortfolioContent>;

export function portfolioFor(source: PortfolioSource, locale: Locale): Portfolio {
  return resolveLocale(source.load(), locale);
}
