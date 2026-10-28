import Link from "next/link";
import type { Locale } from "@/domain/locale";
import type { Portfolio } from "@/domain/view";
import { pagePath } from "@/lib/routes";
import { ArcadeGame } from "@/components/arcade/ArcadeGame";
import { arcadeCopy } from "@/components/arcade/copy";

export function ArcadePage({ portfolio, locale }: { portfolio: Portfolio; locale: Locale }) {
  return (
    <>
      <noscript>
        <p className="arcade-noscript">
          <Link href={pagePath("quick", locale)}>{arcadeCopy[locale].noscript}</Link>
        </p>
      </noscript>
      <ArcadeGame portfolio={portfolio} locale={locale} />
    </>
  );
}
