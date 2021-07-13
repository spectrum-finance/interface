import React, { createContext, useState } from 'react';
import { ErgoBox } from 'ergo-dex-sdk/build/module/ergo';
import { useInterval } from '../hooks/useInterval';

type WalletContextType = {
  isWalletConnected: boolean;
  utxos: ErgoBox[] | undefined;
  setIsWalletConnected: (isWalletConnected: boolean) => void;
};

function noop() {
  return;
}

const WalletContext = createContext<WalletContextType>({
  isWalletConnected: false,
  utxos: undefined,
  setIsWalletConnected: noop,
});

const WalletContextProvider = ({
  children,
}: React.PropsWithChildren<unknown>): JSX.Element => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [utxos, setUtxos] = useState<ErgoBox[]>();

  const ctxValue = {
    isWalletConnected,
    setIsWalletConnected,
    utxos,
  };

  useInterval(() => {
    if (!isWalletConnected) return;

    ergo.get_utxos().then((data: ErgoBox[] | undefined) => {
      setUtxos(data ?? []);
    });
  }, 10 * 1000);

  return (
    <WalletContext.Provider value={ctxValue}>{children}</WalletContext.Provider>
  );
};

export { WalletContext, WalletContextProvider };
