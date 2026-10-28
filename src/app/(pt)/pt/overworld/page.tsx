import { OverworldPage } from "@/components/overworld/OverworldPage";
import { versions } from "@/content/versions";
import { metadataFor } from "@/lib/site";

export const metadata = metadataFor("pt", "overworld", versions.find((version) => version.id === "overworld")?.name.pt);

export default function PortugueseOverworldPage() {
  return <OverworldPage locale="pt" />;
}
