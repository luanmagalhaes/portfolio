import { PixelIcon } from "@/components/overworld/ui/PixelIcon";

export function Toast({ message }: { message: string | null }) {
  return (
    <div className="toast" role="status" aria-live="polite" data-show={Boolean(message)}>
      {message ? (
        <>
          <PixelIcon name="star" />
          <span>{message}</span>
        </>
      ) : null}
    </div>
  );
}
