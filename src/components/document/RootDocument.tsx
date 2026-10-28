import type { ReactNode } from "react";
import { localeTags, type Locale } from "@/domain/locale";
import { bodyFont, pixelFont } from "@/lib/fonts";
import "@/app/globals.css";

export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={localeTags[locale]} className={`${pixelFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
