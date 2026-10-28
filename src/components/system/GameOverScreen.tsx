import type { ReactNode } from "react";
import { PixelDuo } from "@/components/sprites/PixelDuo";
import "@/components/system/system.css";

export interface GameOverMessage {
  lang: string;
  title: string;
  body: string;
  actions: ReactNode;
}

export function GameOverScreen({ code, messages }: { code: string; messages: GameOverMessage[] }) {
  return (
    <main className="game-over">
      <p className="game-over-code" aria-hidden="true">
        {code}
      </p>
      <div className="game-over-messages">
        {messages.map((message) => (
          <section key={message.lang} lang={message.lang} className="game-over-message">
            <h1 className="game-over-title">{message.title}</h1>
            <p className="game-over-body">{message.body}</p>
            <div className="game-over-actions">{message.actions}</div>
          </section>
        ))}
      </div>
      <PixelDuo />
    </main>
  );
}
