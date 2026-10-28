import { ArcadePage } from "@/components/arcade/ArcadePage";
import { arcadeTitle } from "@/components/arcade/title";
import { staticPortfolioSource } from "@/content";
import { portfolioFor } from "@/domain/view";
import { metadataFor } from "@/lib/site";

export const metadata = metadataFor("en", "arcade", arcadeTitle("en"));

export default function EnglishArcadePage() {
  return <ArcadePage portfolio={portfolioFor(staticPortfolioSource, "en")} locale="en" />;
}
