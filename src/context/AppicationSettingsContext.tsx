import { useLocalStorage } from '@rehooks/local-storage';
import { Settings as LuxonSettings } from 'luxon';
import { createContext, useContext, useEffect } from 'react';
import * as React from 'react';
import { map, Observable, publishReplay, refCount } from 'rxjs';

import { DEFAULT_LOCALE, SupportedLocale } from '../common/constants/locales';
import { localStorageManager } from '../common/utils/localStorageManager';
import { isDarkOsTheme } from '../utils/osTheme';

export type Theme = 'light' | 'dark' | 'system' | 'snek' | 'hosky';

export type Settings = {
  explorerUrl: string;
  theme: Theme;
  lang: SupportedLocale;
};

export const DefaultSettings: Readonly<Settings> = {
  explorerUrl: '',
  theme: isDarkOsTheme() ? 'dark' : 'light',
  lang: DEFAULT_LOCALE,
};

function noop() {
  return;
}

// NOTE: there is a bug in v2.4.1 where this should be defined, so define manually
// see https://github.com/rehooks/local-storage/issues/77
type LocalStorageReturnValue<TValue> = [
  TValue,
  (newValue: TValue) => void,
  () => void,
];

const defaultContextValue: LocalStorageReturnValue<Settings> = [
  DefaultSettings,
  noop,
  noop,
];

const AppicationSettingsContext = createContext(defaultContextValue);

export const getSetting = (
  setting: keyof Settings,
): Settings[keyof Settings] => {
  const settings = localStorage.getItem('settings');
  // @ts-ignore
  return settings ? settings[setting] : undefined;
};

export const SettingsProvider = ({
  children,
}: React.PropsWithChildren<unknown>): JSX.Element => {
  const ctxValue = useLocalStorage('settings', DefaultSettings);

  const [userSettings, setUserSettings] = ctxValue;

  useEffect(() => {
    const userSettingsKeys = Object.keys(userSettings);
    const defaultSettingsKeys = Object.keys(DefaultSettings);
    const filteredDefaultSettingsKeys = defaultSettingsKeys.filter(
      (val) => !userSettingsKeys.includes(val),
    );
    const isEqualUserAndDefaultSettingsFields =
      filteredDefaultSettingsKeys.length === 0;

    if (!isEqualUserAndDefaultSettingsFields) {
      const diffs = filteredDefaultSettingsKeys.reduce((acc, key) => {
        return {
          ...acc,
          // @ts-ignore
          [key]: DefaultSettings[key],
        };
      }, {} as any);

      setUserSettings({
        ...userSettings,
        ...diffs,
      });
    }
  }, []);

  useEffect(() => {
    LuxonSettings.defaultLocale = userSettings.lang;
  }, [userSettings.lang]);

  return (
    <AppicationSettingsContext.Provider value={ctxValue}>
      {children}
    </AppicationSettingsContext.Provider>
  );
};

export const useApplicationSettings = (): LocalStorageReturnValue<Settings> =>
  useContext(AppicationSettingsContext);

export const applicationSettings$: Observable<Settings> = localStorageManager
  .getStream<Settings>('settings')
  .pipe(
    map((settings) => settings || DefaultSettings),
    publishReplay(1),
    refCount(),
  );
