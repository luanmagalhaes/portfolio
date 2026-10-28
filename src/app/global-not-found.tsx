import type { Metadata } from "next";
import Link from "next/link";
import { GameOverScreen, type GameOverMessage } from "@/components/system/GameOverScreen";
import { bodyFont, pixelFont } from "@/lib/fonts";
import { pagePath } from "@/lib/routes";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "404 · Luan Magalhães",
  description: "This page does not exist. Esta página não existe.",
  robots: { index: false },
};

const messages: GameOverMessage[] = [
  {
    lang: "en",
    title: "Game over. This page does not exist.",
    body: "The link may be old or have a typo. Pick a version of the portfolio and keep playing.",
    actions: (
      <>
        <Link className="pixel-button pixel-button-primary" href={pagePath("home", "en")}>
          Back to the versions
        </Link>
        <Link className="pixel-button" href={pagePath("quick", "en")}>
          Quick view
        </Link>
      </>
    ),
  },
  {
    lang: "pt-BR",
    title: "Fim de jogo. Esta página não existe.",
    body: "O link pode estar antigo ou com algum erro de digitação. Escolha uma versão do portfólio e continue jogando.",
    actions: (
      <>
        <Link className="pixel-button pixel-button-primary" href={pagePath("home", "pt")} hrefLang="pt-BR">
          Voltar para as versões
        </Link>
        <Link className="pixel-button" href={pagePath("quick", "pt")} hrefLang="pt-BR">
          Visão rápida
        </Link>
      </>
    ),
  },
];

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${pixelFont.variable} ${bodyFont.variable}`}>
      <body>
        <GameOverScreen code="404" messages={messages} />
      </body>
    </html>
  );
}
