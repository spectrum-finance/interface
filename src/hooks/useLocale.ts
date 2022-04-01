import { useMemo } from 'react';

import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  SupportedLocale,
} from '../common/constants/locales';
import { getSetting, useSettings } from '../context';
import { parsedQueryString, useQuery } from './useQuery';

/**
 * Given a locale string (e.g. from user agent), return the best match for corresponding SupportedLocale
 * @param maybeSupportedLocale the fuzzy locale identifier
 */
function parseLocale(
  maybeSupportedLocale: unknown,
): SupportedLocale | undefined {
  if (typeof maybeSupportedLocale !== 'string') return undefined;
  const lowerMaybeSupportedLocale = maybeSupportedLocale.toLowerCase();
  return SUPPORTED_LOCALES.find(
    (locale) =>
      locale.toLowerCase() === lowerMaybeSupportedLocale ||
      locale.split('-')[0] === lowerMaybeSupportedLocale,
  );
}

/**
 * Returns the supported locale read from the user agent (navigator)
 */
export function navigatorLocale(): SupportedLocale | undefined {
  if (!navigator.language) return undefined;

  const [language, region] = navigator.language.split('-');

  if (region) {
    return (
      parseLocale(`${language}-${region.toUpperCase()}`) ??
      parseLocale(language)
    );
  }

  return parseLocale(language);
}

function useUserSettingsLocale(): SupportedLocale {
  const [{ lang }] = useSettings();
  return lang;
}

export const initialLocale =
  parseLocale(parsedQueryString().lng) ?? getSetting('lang')
    ? String(getSetting('lang'))
    : undefined ?? navigatorLocale() ?? DEFAULT_LOCALE;

const useUrlLocale = () => parseLocale(useQuery().lng);

/**
 * Returns the currently active locale, from a combination of user agent, query string, and user settings stored in redux
 * Stores the query string locale in redux (if set) to persist across sessions
 */
export function useLocale(): SupportedLocale {
  const urlLocale = useUrlLocale();
  const userLocale = useUserSettingsLocale();

  return useMemo(
    () => urlLocale ?? userLocale ?? navigatorLocale() ?? DEFAULT_LOCALE,
    [urlLocale, userLocale],
  );
}
