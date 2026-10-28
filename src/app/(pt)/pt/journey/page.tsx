import { JourneyPage } from "@/components/journey/JourneyPage";
import { journeyCopyFor } from "@/components/journey/copy";
import { metadataFor } from "@/lib/site";

export const metadata = metadataFor("pt", "journey", journeyCopyFor("pt").pageTitle);

export default function PortugueseJourneyPage() {
  return <JourneyPage locale="pt" />;
}
