import type { Localized } from "@/domain/locale";

export const versionIds = ["arcade", "overworld", "journey"] as const;

export type VersionId = (typeof versionIds)[number];

export interface VersionContent {
  id: VersionId;
  name: Localized;
  tagline: Localized;
  preview: string;
}
