import React, { createContext, useState } from 'react';
import { ErgoBox } from 'ergo-dex-sdk/build/module/ergo';
import { useInterval } from '../hooks/useInterval';

type UTXOsContextType = {
  utxos: ErgoBox[] | undefined;
};

export const UTXOsContext = createContext<UTXOsContextType>({
  utxos: undefined,
});

const initialState = {
  utxos: undefined,
};

export const UTXOsContextProvider = ({
  children,
}: React.PropsWithChildren<unknown>): JSX.Element => {
  const [state, setState] = useState<UTXOsContextType>(initialState);

  useInterval(() => {
    ergo.get_utxos().then((data: ErgoBox[] | undefined) => {
      setState({ utxos: data ?? [] });
    });
  }, 10 * 1000);

  return (
    <UTXOsContext.Provider value={state}>{children}</UTXOsContext.Provider>
  );
};
