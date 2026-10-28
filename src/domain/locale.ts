export const locales = ["en", "pt"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export type Localized<T = string> = Record<Locale, T>;

export const localeTags: Record<Locale, string> = { en: "en", pt: "pt-BR" };

export const localePaths: Record<Locale, string> = { en: "/", pt: "/pt" };

export type Resolved<T> = T extends Localized<infer U> ? Resolved<U> : T extends readonly (infer I)[] ? Resolved<I>[] : T extends object ? { [K in keyof T]: Resolved<T[K]> } : T;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function isLocalized(value: unknown): value is Localized<unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const keys = Object.keys(value);

  return keys.length === locales.length && locales.every((locale) => keys.includes(locale));
}

export function resolveLocale<T>(value: T, locale: Locale): Resolved<T> {
  if (isLocalized(value)) {
    return resolveLocale(value[locale], locale) as Resolved<T>;
  }

  if (Array.isArray(value)) {
    return value.map((item) => resolveLocale(item, locale)) as Resolved<T>;
  }

  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveLocale(item, locale)])) as Resolved<T>;
  }

  return value as Resolved<T>;
}
