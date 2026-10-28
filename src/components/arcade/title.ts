import { versions } from "@/content/versions";
import type { Locale } from "@/domain/locale";

export function arcadeTitle(locale: Locale): string {
  return versions.find((version) => version.id === "arcade")?.name[locale] ?? "Arcade";
}
