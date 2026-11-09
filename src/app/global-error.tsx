"use client";

import { ErrorScreen } from "@/components/system/ErrorScreen";
import { bodyFont, pixelFont } from "@/lib/fonts";
import "@/app/globals.css";

export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en" className={`${pixelFont.variable} ${bodyFont.variable}`}>
      <body>
        <title>Error · Erro · Luan Magalhães</title>
        <ErrorScreen locales={["en", "pt"]} error={error} retry={retry} />
      </body>
    </html>
  );
}
