import type { ArcadeCopy } from "@/components/arcade/copy";

export function ArcadeFooter({ copy }: { copy: ArcadeCopy }) {
  return (
    <footer className="hints">
      <div className="hints-inner" id="arcade-footer">
        <p>
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd>
            {copy.hintMove}
          </span>
          <span>
            <kbd>Enter</kbd>
            {copy.hintSelect}
          </span>
          <span>
            <kbd>Esc</kbd>
            {copy.hintBack}
          </span>
          <span>
            <kbd>Q</kbd>
            {copy.hintQuick}
          </span>
        </p>
        <p>{copy.hintNote}</p>
      </div>
    </footer>
  );
}
