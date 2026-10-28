import { QuickView } from "@/components/quick/QuickView";
import { staticPortfolioSource } from "@/content";
import type { Locale } from "@/domain/locale";
import { portfolioFor } from "@/domain/view";
import { dictionaryFor } from "@/i18n/dictionary";

export function PortfolioPage({ locale }: { locale: Locale }) {
  const portfolio = portfolioFor(staticPortfolioSource, locale);
  const dictionary = dictionaryFor(locale);

  return <QuickView portfolio={portfolio} dictionary={dictionary} locale={locale} />;
}
