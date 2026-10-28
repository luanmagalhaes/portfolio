import { OverworldPage } from "@/components/overworld/OverworldPage";
import { versions } from "@/content/versions";
import { metadataFor } from "@/lib/site";

export const metadata = metadataFor("en", "overworld", versions.find((version) => version.id === "overworld")?.name.en);

export default function EnglishOverworldPage() {
  return <OverworldPage locale="en" />;
}
