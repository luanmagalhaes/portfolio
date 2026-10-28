"use client";

import { useEffect } from "react";
import type { ArcadeCopy, BiosFacts } from "@/components/arcade/copy";
import { PixelSprite } from "@/components/arcade/PixelSprite";

const lineDelay = 110;

export function BootScreen({ copy, facts, onDone }: { copy: ArcadeCopy; facts: BiosFacts; onDone: () => void }) {
  const lines = copy.bios(facts);
  const total = lines.length * lineDelay + 520;

  useEffect(() => {
    const timer = window.setTimeout(onDone, total);
    return () => window.clearTimeout(timer);
  }, [onDone, total]);

  return (
    <section className="screen screen--boot" data-screen="boot" onClick={onDone}>
      <p className="sr-only">{copy.booting}</p>
      <pre className="bios" aria-hidden="true">
        {lines.map(([label, value], index) => (
          <span key={`${index}-${label}`} className="bios-line" style={{ animationDelay: `${index * lineDelay}ms` }}>
            {label}
            {value ? <span className="ok"> {value}</span> : null}
            {"\n"}
          </span>
        ))}
      </pre>
      <p className="boot-badge" aria-hidden="true">
        <PixelSprite id="miniCart" />
        LM-16
      </p>
      <p className="boot-skip">{copy.bootSkip}</p>
    </section>
  );
}
