import type { ReactNode } from "react";

export function Section({ id, title, intro, children }: { id: string; title: string; intro?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
      <h2 id={`${id}-title`} className="font-pixel text-2xl text-yellow sm:text-3xl">
        {title}
      </h2>
      {intro ? <p className="mt-2 max-w-2xl text-silver">{intro}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item} className="chip">
          {item}
        </li>
      ))}
    </ul>
  );
}
