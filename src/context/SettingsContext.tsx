import { PublicKey } from '@ergolabs/ergo-sdk';
import { useLocalStorage } from '@rehooks/local-storage';
import React, { createContext, useContext } from 'react';

// import { LocalStorageReturnValue } from '@rehooks/local-storage/lib/use-localstorage';
import { ERG_EXPLORER_URL } from '../constants/env';
import { defaultMinerFee, defaultSlippage } from '../constants/settings';

export type Settings = {
  minerFee: string;
  slippage: string;
  address?: string;
  pk?: PublicKey;
  explorerUrl: string;
};

export const DefaultSettings: Readonly<Settings> = {
  minerFee: defaultMinerFee.toString(),
  slippage: defaultSlippage.toString(),
  explorerUrl: ERG_EXPLORER_URL,
  pk: '',
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

export const SettingsProvider = ({
  children,
}: React.PropsWithChildren<unknown>): JSX.Element => {
  const ctxValue = useLocalStorage('settings', DefaultSettings);

  return (
    <SettingsContext.Provider value={ctxValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): LocalStorageReturnValue<Settings> =>
  useContext(SettingsContext);
