import { useLocalStorage } from '@rehooks/local-storage';
import React, { createContext, useContext } from 'react';

import { MinerFeeDefault, SlippageDefault } from '../constants/settings';
// import { LocalStorageReturnValue } from '@rehooks/local-storage/lib/use-localstorage';

export type Settings = {
  minerFee: string;
  slippage: string;
  address?: string;
};

export const DefaultSettings: Readonly<Settings> = {
  minerFee: MinerFeeDefault.toString(),
  slippage: String(SlippageDefault),
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
