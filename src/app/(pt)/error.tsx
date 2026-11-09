"use client";

import { ErrorScreen } from "@/components/system/ErrorScreen";

export default function PortugueseError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorScreen locales={["pt"]} error={error} retry={retry} />;
}
