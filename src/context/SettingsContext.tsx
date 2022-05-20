import { PublicKey } from '@ergolabs/ergo-sdk';
import { useLocalStorage } from '@rehooks/local-storage';
import React, { createContext, useContext, useEffect } from 'react';

import { MIN_NITRO } from '../common/constants/erg';
import { DEFAULT_LOCALE, SupportedLocale } from '../common/constants/locales';
import { defaultMinerFee, defaultSlippage } from '../common/constants/settings';
import { isDarkOsTheme } from '../utils/osTheme';

export type Settings = {
  minerFee: number;
  slippage: number;
  address?: string;
  nitro: number;
  pk?: PublicKey;
  explorerUrl: string;
  theme: string;
  lang: SupportedLocale;
};

export const DefaultSettings: Readonly<Settings> = {
  minerFee: defaultMinerFee,
  nitro: MIN_NITRO,
  slippage: defaultSlippage,
  explorerUrl: '',
  pk: '',
  theme: isDarkOsTheme() ? 'dark' : 'light',
  lang: DEFAULT_LOCALE,
  address: undefined,
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

const SettingsContext = createContext(defaultContextValue);

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

  // useEffect(() => {
  //   if (!usedAddresses || !unusedAddresses) {
  //     return;
  //   }
  //
  //   let newSelectedAddress: Address;
  //   const addresses = unusedAddresses.concat(usedAddresses);
  //   const currentSelectedAddress = ctxValue[0].address;
  //
  //   if (isCurrentAddressValid(currentSelectedAddress, addresses)) {
  //     newSelectedAddress = currentSelectedAddress!;
  //   } else {
  //     newSelectedAddress = unusedAddresses[0] || usedAddresses[0];
  //   }
  //
  //   let pk: string | undefined;
  //
  //   try {
  //     pk = publicKeyFromAddress(newSelectedAddress);
  //   } catch (e: any) {
  //     pk = pubKeyHashFromAddr(newSelectedAddress, RustModule._wasm!);
  //   }
  //
  //   ctxValue[1]({
  //     ...ctxValue[0],
  //     address: newSelectedAddress,
  //     pk,
  //   });
  // }, [usedAddresses, unusedAddresses]);

  return (
    <SettingsContext.Provider value={ctxValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): LocalStorageReturnValue<Settings> =>
  useContext(SettingsContext);
