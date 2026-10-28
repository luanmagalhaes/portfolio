import { ArcadePage } from "@/components/arcade/ArcadePage";
import { arcadeTitle } from "@/components/arcade/title";
import { staticPortfolioSource } from "@/content";
import { portfolioFor } from "@/domain/view";
import { metadataFor } from "@/lib/site";

export const metadata = metadataFor("pt", "arcade", arcadeTitle("pt"));

export default function PortugueseArcadePage() {
  return <ArcadePage portfolio={portfolioFor(staticPortfolioSource, "pt")} locale="pt" />;
}
