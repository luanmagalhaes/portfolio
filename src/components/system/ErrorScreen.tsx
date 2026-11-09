"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { Locale } from "@/domain/locale";
import { pagePath } from "@/lib/routes";
import { GameOverScreen, type GameOverMessage } from "@/components/system/GameOverScreen";

const copy: Record<Locale, { lang: string; title: string; body: string; retry: string; home: string }> = {
  en: {
    lang: "en",
    title: "Something broke on this screen.",
    body: "It was not your fault. Try again, or go back and pick another version of the portfolio.",
    retry: "Try again",
    home: "Back to the versions",
  },
  pt: {
    lang: "pt-BR",
    title: "Algo quebrou nesta tela.",
    body: "Não foi culpa sua. Tente de novo, ou volte e escolha outra versão do portfólio.",
    retry: "Tentar de novo",
    home: "Voltar para as versões",
  },
};

function errorMessage(locale: Locale, retry: () => void): GameOverMessage {
  const text = copy[locale];
  const actions = (
    <>
      <button type="button" className="pixel-button pixel-button-primary" onClick={() => retry()}>
        {text.retry}
      </button>
      <Link className="pixel-button" href={pagePath("home", locale)} hrefLang={text.lang}>
        {text.home}
      </Link>
    </>
  );

  return { lang: text.lang, title: text.title, body: text.body, actions };
}

export function ErrorScreen({ locales, error, retry }: { locales: Locale[]; error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <GameOverScreen code="ERR" messages={locales.map((locale) => errorMessage(locale, retry))} />;
}
