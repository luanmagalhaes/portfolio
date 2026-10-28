import { RootDocument } from "@/components/document/RootDocument";
import { metadataFor } from "@/lib/site";

export const metadata = metadataFor("en");

export default function EnglishLayout({ children }: LayoutProps<"/">) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
