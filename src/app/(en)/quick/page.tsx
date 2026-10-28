import { PortfolioPage } from "@/components/PortfolioPage";
import { metadataFor } from "@/lib/site";

export const metadata = metadataFor("en", "quick", "Quick view");

export default function EnglishQuickPage() {
  return <PortfolioPage locale="en" />;
}
