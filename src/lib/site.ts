import type { Metadata } from "next";
import { localeTags, type Locale } from "@/domain/locale";
import { pagePath, type PageId } from "@/lib/routes";

export const siteUrl = "https://luanmagalhaes.vercel.app";

const descriptions: Record<Locale, string> = {
  en: "Senior software engineer, full stack and AI, with a strong front-end focus. Explore the portfolio as a 16-bit game or in a quick view.",
  pt: "Engenheiro de software sênior, full stack e IA, com foco forte em front-end. Explore o portfólio como um jogo 16-bit ou na visão rápida.",
};

const shareImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Pixel art of Luan Magalhães and his dog Matilda on a beach at sunset, with his name and the title Senior Software Engineer, Full Stack and AI.",
};

const titles: Record<Locale, string> = {
  en: "Luan Magalhães · Senior Software Engineer",
  pt: "Luan Magalhães · Engenheiro de software sênior",
};

export function metadataFor(locale: Locale, page: PageId = "home", title?: string): Metadata {
  const fullTitle = title ? `${title} · ${titles[locale]}` : titles[locale];

  return {
    metadataBase: new URL(siteUrl),
    title: fullTitle,
    description: descriptions[locale],
    alternates: {
      canonical: pagePath(page, locale),
      languages: { [localeTags.en]: pagePath(page, "en"), [localeTags.pt]: pagePath(page, "pt"), "x-default": pagePath(page, "en") },
    },
    openGraph: {
      type: "profile",
      url: pagePath(page, locale),
      title: fullTitle,
      description: descriptions[locale],
      locale: localeTags[locale].replace("-", "_"),
      siteName: "Luan Magalhães",
      images: [shareImage],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: descriptions[locale], images: [shareImage] },
  };
}
