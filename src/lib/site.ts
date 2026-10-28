import type { Metadata } from "next";
import { localePaths, localeTags, type Locale } from "@/domain/locale";

export const siteUrl = "https://luanmagalhaes.vercel.app";

const descriptions: Record<Locale, string> = {
  en: "Senior software engineer, full stack and AI, with a strong front-end focus. Explore the portfolio as a 16-bit game or in a quick view.",
  pt: "Engenheiro de software sênior, full stack e IA, com foco forte em front-end. Explore o portfólio como um jogo 16-bit ou na visão rápida.",
};

const titles: Record<Locale, string> = {
  en: "Luan Magalhães · Senior Software Engineer",
  pt: "Luan Magalhães · Engenheiro de software sênior",
};

export function metadataFor(locale: Locale): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical: localePaths[locale],
      languages: { [localeTags.en]: localePaths.en, [localeTags.pt]: localePaths.pt, "x-default": localePaths.en },
    },
    openGraph: {
      type: "profile",
      url: localePaths[locale],
      title: titles[locale],
      description: descriptions[locale],
      locale: localeTags[locale].replace("-", "_"),
      siteName: "Luan Magalhães",
    },
    twitter: { card: "summary_large_image", title: titles[locale], description: descriptions[locale] },
  };
}
