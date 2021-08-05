import React, { createContext, useEffect, useState } from 'react';
import { ErgoBox, ergoBoxFromProxy } from 'ergo-dex-sdk/build/module/ergo';
import { useInterval } from '../hooks/useInterval';
import Cookies from 'js-cookie';

type WalletContextType = {
  isWalletConnected: boolean;
  utxos: ErgoBox[] | undefined;
  setIsWalletConnected: (isWalletConnected: boolean) => void;
};

function noop() {
  return;
}

export const WalletContext = createContext<WalletContextType>({
  isWalletConnected: false,
  utxos: undefined,
  setIsWalletConnected: noop,
});

const fetchUtxos = () =>
  ergo
    .get_utxos()
    .then((bs) => bs?.map((b) => ergoBoxFromProxy(b)))
    .then((data: ErgoBox[] | undefined) => {
      return data ?? [];
    });

export const WalletContextProvider = ({
  children,
}: React.PropsWithChildren<unknown>): JSX.Element => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [utxos, setUtxos] = useState<ErgoBox[]>();

  const ctxValue = {
    isWalletConnected,
    setIsWalletConnected,
    utxos,
  };

  useEffect(() => {
    if (
      Cookies.get('wallet-connected') === 'true' &&
      window.ergo_request_read_access
    ) {
      window.ergo_request_read_access().then(setIsWalletConnected);
    }
  }, [isWalletConnected]);

  useEffect(() => {
    if (isWalletConnected) {
      fetchUtxos().then(setUtxos);
    }
  }, [isWalletConnected]);

  useInterval(() => {
    if (isWalletConnected) {
      fetchUtxos().then(setUtxos);
    }
  }, 10 * 1000);

  return (
    <WalletContext.Provider value={ctxValue}>{children}</WalletContext.Provider>
  );
};
