import { en, type Dictionary } from './en';

/**
 * Locale registry. To add a language, create `az.ts` / `ru.ts` exporting a
 * `Dictionary`, register it here, and add a page per locale.
 */
export const locales = { en } satisfies Record<string, Dictionary>;
export type Locale = keyof typeof locales;
export const defaultLocale: Locale = 'en';

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return locales[locale];
}

/** Replace `{name}` tokens in a string. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export type { Dictionary };
