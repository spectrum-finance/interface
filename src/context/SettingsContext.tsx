import { Address, PublicKey, publicKeyFromAddress } from '@ergolabs/ergo-sdk';
import { useLocalStorage } from '@rehooks/local-storage';
import React, { createContext, useContext, useEffect } from 'react';

import { getUnusedAddresses, getUsedAddresses } from '../api/addresses';
import { ERG_EXPLORER_URL } from '../common/constants/env';
import { MIN_NITRO } from '../common/constants/erg';
import { defaultMinerFee, defaultSlippage } from '../common/constants/settings';
import { useObservable } from '../common/hooks/useObservable';
import { isDarkOsTheme } from '../utils/osTheme';

export type Settings = {
  minerFee: number;
  slippage: number;
  address?: string;
  nitro: number;
  pk?: PublicKey;
  explorerUrl: string;
  theme: string;
};

export const DefaultSettings: Readonly<Settings> = {
  minerFee: defaultMinerFee,
  nitro: MIN_NITRO,
  slippage: defaultSlippage,
  explorerUrl: ERG_EXPLORER_URL,
  pk: '',
  theme: isDarkOsTheme() ? 'dark' : 'light',
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

const isCurrentAddressValid = (
  address: Address | undefined,
  addresses: Address[],
): boolean => !!address && addresses.includes(address);

export const SettingsProvider = ({
  children,
}: React.PropsWithChildren<unknown>): JSX.Element => {
  const ctxValue = useLocalStorage('settings', DefaultSettings);
  const [usedAddresses] = useObservable(getUsedAddresses());
  const [unusedAddresses] = useObservable(getUnusedAddresses());

  useEffect(() => {
    if (!usedAddresses || !unusedAddresses) {
      return;
    }
    let newSelectedAddress: Address;
    const addresses = unusedAddresses.concat(usedAddresses);
    const currentSelectedAddress = ctxValue[0].address;

    if (isCurrentAddressValid(currentSelectedAddress, addresses)) {
      newSelectedAddress = currentSelectedAddress!;
    } else {
      newSelectedAddress = unusedAddresses[0] || usedAddresses[0];
    }

    if (!ctxValue[0].address && addresses) {
      ctxValue[1]({
        ...ctxValue[0],
        address: newSelectedAddress,
        pk: publicKeyFromAddress(newSelectedAddress),
      });
    }
  }, [usedAddresses, unusedAddresses]);

  return (
    <SettingsContext.Provider value={ctxValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): LocalStorageReturnValue<Settings> =>
  useContext(SettingsContext);
