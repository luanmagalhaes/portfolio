import { staticPortfolioSource } from "@/content";
import type { Locale } from "@/domain/locale";
import { portfolioFor } from "@/domain/view";
import { journeyCopyFor } from "@/components/journey/copy";
import { journeyFontClasses } from "@/components/journey/fonts";
import { JourneyGame } from "@/components/journey/game/JourneyGame";
import { buildLevel } from "@/components/journey/model/level";
import "@/components/journey/journey.css";

export function JourneyPage({ locale }: { locale: Locale }) {
  const portfolio = portfolioFor(staticPortfolioSource, locale);

  return <JourneyGame portfolio={portfolio} copy={journeyCopyFor(locale)} locale={locale} nodes={buildLevel(portfolio)} fontClasses={journeyFontClasses} />;
}
