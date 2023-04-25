import { useLocalStorage } from '@rehooks/local-storage';
import { createContext, useContext } from 'react';
import * as React from 'react';

export type AppLoadingState = {
  isKYAAccepted: boolean;
};

// NOTE: there is a bug in v2.4.1 where this should be defined, so define manually
// see https://github.com/rehooks/local-storage/issues/77
type LocalStorageReturnValue<TValue> = [
  TValue,
  (newValue: TValue) => void,
  () => void,
];

const defaultCtxValue: LocalStorageReturnValue<AppLoadingState> = [
  {
    isKYAAccepted: false,
  },
  () => {},
  () => {},
];

const AppLoadingContext = createContext(defaultCtxValue);

export const AppLoadingProvider = ({
  children,
}: React.PropsWithChildren<unknown>): JSX.Element => {
  const ctxValue = useLocalStorage('appLoadingState', defaultCtxValue[0]);

  return (
    <AppLoadingContext.Provider value={ctxValue}>
      {children}
    </AppLoadingContext.Provider>
  );
};

export const useAppLoadingState: () => LocalStorageReturnValue<AppLoadingState> =
  () => useContext(AppLoadingContext);
