"use client";

import { ErrorScreen } from "@/components/system/ErrorScreen";

export default function EnglishError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorScreen locale="en" error={error} retry={retry} />;
}
