import { Overworld } from "@/components/overworld/Overworld";
import { overworldCopy } from "@/components/overworld/copy";
import { overworldLinks } from "@/components/overworld/links";
import { staticPortfolioSource } from "@/content";
import type { Locale } from "@/domain/locale";
import { portfolioFor } from "@/domain/view";

export function OverworldPage({ locale }: { locale: Locale }) {
  const portfolio = portfolioFor(staticPortfolioSource, locale);
  const links = overworldLinks(locale);
  const copy = overworldCopy(locale);
  return (
    <>
      <noscript>
        <p className="ow-noscript">
          {copy.noscript} <a href={links.quick}>{copy.quickView}</a>
        </p>
      </noscript>
      <Overworld portfolio={portfolio} locale={locale} links={links} />
    </>
  );
}
