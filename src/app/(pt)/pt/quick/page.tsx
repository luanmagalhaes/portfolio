import { PortfolioPage } from "@/components/PortfolioPage";
import { metadataFor } from "@/lib/site";

export const metadata = metadataFor("pt", "quick", "Visão rápida");

export default function PortugueseQuickPage() {
  return <PortfolioPage locale="pt" />;
}
