"use client";

import { useRef, type KeyboardEvent } from "react";
import type { OverworldCopy } from "@/components/overworld/copy";
import { Emblem } from "@/components/overworld/ui/Emblem";
import { PixelIcon } from "@/components/overworld/ui/PixelIcon";
import type { Portfolio } from "@/domain/view";

const groupIcons: Record<string, string> = { engineering: "hammer", ai: "spark", "front-end": "window", "back-end": "gear", "data-infra": "database", integrations: "external" };

export function inventoryTabs(portfolio: Portfolio, copy: OverworldCopy): { id: string; icon: string; label: string }[] {
  return [...portfolio.skills.map((group) => ({ id: group.id, icon: groupIcons[group.id] ?? "star", label: group.name })), { id: "key", icon: "key", label: copy.keyItems }, { id: "locked", icon: "lock", label: copy.locked }];
}

export function InventoryWindow({ portfolio, copy, tab, onTab }: { portfolio: Portfolio; copy: OverworldCopy; tab: string; onTab: (tab: string) => void }) {
  const tabs = inventoryTabs(portfolio, copy);
  const current = tabs.some((entry) => entry.id === tab) ? tab : tabs[0].id;
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const group = portfolio.skills.find((entry) => entry.id === current);
  const handleKey = (event: KeyboardEvent<HTMLButtonElement>, index: number): void => {
    const delta = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    if (!delta) return;
    event.preventDefault();
    const next = (index + delta + tabs.length) % tabs.length;
    onTab(tabs[next].id);
    buttons.current[next]?.focus();
  };
  return (
    <div className="inventory">
      <div className="inventory__tabs" role="tablist" aria-label={copy.inventory} aria-orientation="vertical">
        {tabs.map((entry, index) => (
          <button
            key={entry.id}
            ref={(element) => {
              buttons.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`ow-tab-${entry.id}`}
            className="inventory__tab"
            aria-selected={entry.id === current}
            aria-controls="ow-inventory-panel"
            tabIndex={entry.id === current ? 0 : -1}
            onClick={() => onTab(entry.id)}
            onKeyDown={(event) => handleKey(event, index)}
          >
            <PixelIcon name={entry.icon} />
            <span>{entry.label}</span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id="ow-inventory-panel" aria-labelledby={`ow-tab-${current}`} tabIndex={0}>
        <ul className="slots">
          {group
            ? group.items.map((item) => (
                <li key={item} className="slot">
                  <PixelIcon name={groupIcons[group.id] ?? "star"} />
                  <span className="slot__text">
                    <strong>{item}</strong>
                  </span>
                </li>
              ))
            : null}
          {current === "key" ? (
            <>
              {portfolio.languages.map((language) => (
                <li key={language.id} className="slot">
                  <PixelIcon name="globe" />
                  <span className="slot__text">
                    <strong>{language.name}</strong>
                    <span>{language.level}</span>
                  </span>
                </li>
              ))}
              {portfolio.education.map((entry) => (
                <li key={entry.id} className="slot slot--wide">
                  <PixelIcon name="book" />
                  <span className="slot__text">
                    <strong>{entry.title}</strong>
                    <span>{[entry.school, entry.period].filter(Boolean).join(" · ")}</span>
                  </span>
                </li>
              ))}
            </>
          ) : null}
          {current === "locked"
            ? portfolio.privateApps.map((app) => (
                <li key={app.id} className="slot slot--wide slot--locked">
                  <Emblem emblem={app.emblem} locked />
                  <span className="slot__text">
                    <strong>{app.name}</strong>
                    <span>{app.pitch}</span>
                    <span className="badge badge--dark">{copy.privateBuild}</span>
                  </span>
                </li>
              ))
            : null}
        </ul>
      </div>
    </div>
  );
}
