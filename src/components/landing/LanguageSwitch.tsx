import Link from "next/link";
import { localeTags, locales, type Locale } from "@/domain/locale";
import { pagePath, type PageId } from "@/lib/routes";

export function LanguageSwitch({ locale, page, label }: { locale: Locale; page: PageId; label: string }) {
  return (
    <nav aria-label={label} className="language-switch">
      {locales.map((item) => (
        <Link key={item} href={pagePath(page, item)} hrefLang={localeTags[item]} aria-current={item === locale ? "page" : undefined} className="language-option">
          {item.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
