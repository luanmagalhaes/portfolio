import Image from "next/image";
import { emblemSrc } from "@/components/overworld/model/routing";

export function Emblem({ emblem, size = 32, locked = false }: { emblem: string; size?: 32 | 64; locked?: boolean }) {
  return (
    <span className={`emblem emblem--${size}`} aria-hidden="true">
      <Image src={emblemSrc(emblem)} alt="" width={size} height={size} unoptimized />
      {locked ? <Image className="emblem__lock" src="/kit/emblems/apps/lock-overlay.png" alt="" width={size} height={size} unoptimized /> : null}
    </span>
  );
}
