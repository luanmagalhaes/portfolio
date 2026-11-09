"use client";

import type { FocusEvent, ReactNode } from "react";

function revealFocused(event: FocusEvent<HTMLElement>) {
  event.target.scrollIntoView({ block: "nearest", inline: "nearest" });
}

export function SectionNav({ label, children }: { label: string; children: ReactNode }) {
  return (
    <nav aria-label={label} className="min-w-0 flex-1 overflow-x-auto" onFocus={revealFocused}>
      {children}
    </nav>
  );
}
