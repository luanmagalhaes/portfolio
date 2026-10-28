"use client";

import { ErrorScreen } from "@/components/system/ErrorScreen";
import "@/app/globals.css";

export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body>
        <title>Error · Luan Magalhães</title>
        <ErrorScreen locale="en" error={error} retry={retry} />
      </body>
    </html>
  );
}
