import { JourneyPage } from "@/components/journey/JourneyPage";
import { journeyCopyFor } from "@/components/journey/copy";
import { metadataFor } from "@/lib/site";

export const metadata = metadataFor("en", "journey", journeyCopyFor("en").pageTitle);

export default function EnglishJourneyPage() {
  return <JourneyPage locale="en" />;
}
