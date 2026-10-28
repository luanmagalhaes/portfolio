import type { MouseEvent } from "react";
import type { ArcadeCopy } from "@/components/arcade/copy";
import { PixelSprite } from "@/components/arcade/PixelSprite";

export type PadButton = "up" | "down" | "left" | "right" | "a" | "b" | "start" | "select";

export function HandheldPad({ copy, onPress }: { copy: ArcadeCopy; onPress: (button: PadButton) => void }) {
  const press = (button: PadButton) => () => onPress(button);
  const keepFocus = (event: MouseEvent) => event.preventDefault();

  return (
    <div className="pad" role="group" aria-label={copy.padLabel} onMouseDown={keepFocus}>
      <div className="dpad">
        <button type="button" className="up" aria-label={copy.padUp} onClick={press("up")}>
          <PixelSprite id="up" />
        </button>
        <button type="button" className="left" aria-label={copy.padLeft} onClick={press("left")}>
          <PixelSprite id="left" />
        </button>
        <span className="dpad-hub" aria-hidden="true" />
        <button type="button" className="right" aria-label={copy.padRight} onClick={press("right")}>
          <PixelSprite id="right" />
        </button>
        <button type="button" className="down" aria-label={copy.padDown} onClick={press("down")}>
          <PixelSprite id="down" />
        </button>
      </div>
      <span className="grille" aria-hidden="true" />
      <div className="ab">
        <button type="button" className="ab-btn btn-b" onClick={press("b")}>
          <b>B</b>
          <span>{copy.padB}</span>
        </button>
        <button type="button" className="ab-btn btn-a" onClick={press("a")}>
          <b>A</b>
          <span>{copy.padA}</span>
        </button>
      </div>
      <div className="ss">
        <button type="button" className="ss-btn" onClick={press("select")}>
          <i />
          <span>{copy.padSelect}</span>
        </button>
        <button type="button" className="ss-btn" onClick={press("start")}>
          <i />
          <span>{copy.padStart}</span>
        </button>
      </div>
    </div>
  );
}
