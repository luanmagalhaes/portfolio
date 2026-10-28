"use client";

import { ErrorScreen } from "@/components/system/ErrorScreen";

export default function PortugueseError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorScreen locale="pt" error={error} retry={retry} />;
}
