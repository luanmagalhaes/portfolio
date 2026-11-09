import Image from "next/image";
import Link from "next/link";
import type { Locale, Resolved } from "@/domain/locale";
import type { VersionContent } from "@/domain/site";
import type { Dictionary } from "@/i18n/dictionary";
import { pagePath } from "@/lib/routes";

export function VersionCard({ version, index, locale, dictionary }: { version: Resolved<VersionContent>; index: number; locale: Locale; dictionary: Dictionary }) {
  return (
    <li>
      <Link href={pagePath(version.id, locale)} className="version-card" prefetch={false}>
        <span className="version-frame">
          <Image src={version.preview} alt="" width={960} height={600} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" className="version-image" priority={index === 0} />
        </span>
        <span className="version-body">
          <span className="version-index">{String(index + 1).padStart(2, "0")}</span>
          <span className="version-name">{version.name}</span>
          <span className="version-tagline">{version.tagline}</span>
          <span className="version-play">
            {dictionary.play}
            <span aria-hidden="true" className="version-arrow" />
          </span>
        </span>
      </Link>
    </li>
  );
}
