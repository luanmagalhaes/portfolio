import { RootDocument } from "@/components/document/RootDocument";
import { metadataFor } from "@/lib/site";

export const metadata = metadataFor("pt");

export default function PortugueseLayout({ children }: LayoutProps<"/">) {
  return <RootDocument locale="pt">{children}</RootDocument>;
}
