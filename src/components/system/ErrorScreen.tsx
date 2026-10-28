"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { Locale } from "@/domain/locale";
import { pagePath } from "@/lib/routes";
import { GameOverScreen } from "@/components/system/GameOverScreen";

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

export function ErrorScreen({ locale, error, retry }: { locale: Locale; error: Error & { digest?: string }; retry: () => void }) {
  const text = copy[locale];

  useEffect(() => {
    console.error(error);
  }, [error]);

  const actions = (
    <>
      <button type="button" className="pixel-button pixel-button-primary" onClick={() => retry()}>
        {text.retry}
      </button>
      <Link className="pixel-button" href={pagePath("home", locale)}>
        {text.home}
      </Link>
    </>
  );

  return <GameOverScreen code="ERR" messages={[{ lang: text.lang, title: text.title, body: text.body, actions }]} />;
}
