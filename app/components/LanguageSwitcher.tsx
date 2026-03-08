'use client';

import { useLocale } from '@/app/i18n/provider';
import { SUPPORTED_LOCALES, LOCALE_NAMES, type SupportedLocale } from '@/app/i18n/config';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-1 text-xs">
      {SUPPORTED_LOCALES.map((loc: SupportedLocale, i: number) => (
        <span key={loc} className="flex items-center gap-1">
          {i > 0 && <span className="text-gray-600">/</span>}
          <button
            onClick={() => setLocale(loc)}
            className={`transition-colors ${
              locale === loc
                ? 'text-white font-medium'
                : 'text-gray-500 hover:text-gray-300'
            }`}
            aria-label={`Switch to ${LOCALE_NAMES[loc]}`}
            aria-current={locale === loc ? 'true' : undefined}
          >
            {LOCALE_NAMES[loc]}
          </button>
        </span>
      ))}
    </div>
  );
}
