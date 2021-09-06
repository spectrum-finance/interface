import React, { createContext, useCallback, useEffect, useState } from 'react';
import { ErgoBox, ergoBoxFromProxy } from 'ergo-dex-sdk/build/module/ergo';
import { useInterval } from '../hooks/useInterval';
import { ERG_TOKEN_NAME } from '../constants/erg';
import { walletCookies } from '../utils/cookies';

export enum WalletConnectionState {
  NOT_CONNECTED, // initial state
  CONNECTED,
  DISCONNECTED,
}

type WalletContextType = {
  isWalletConnected: boolean; // @deprecated in favour of walletConnectionState
  walletConnectionState: WalletConnectionState;
  utxos: ErgoBox[] | undefined;
  setIsWalletConnected: (isWalletConnected: boolean) => void;
  ergBalance: string | undefined;
};

function noop() {
  return;
}

export const WalletContext = createContext<WalletContextType>({
  isWalletConnected: false,
  walletConnectionState: WalletConnectionState.NOT_CONNECTED,
  utxos: undefined,
  setIsWalletConnected: noop,
  ergBalance: undefined,
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
  const [walletConnectionState, setWalletConnectionState] = useState(
    WalletConnectionState.NOT_CONNECTED,
  );
  const [utxos, setUtxos] = useState<ErgoBox[]>();
  const [ergBalance, setErgBalance] = useState<string | undefined>();

  const setIsWalletConnected = useCallback((isConnected: boolean) => {
    setWalletConnectionState(
      isConnected
        ? WalletConnectionState.CONNECTED
        : WalletConnectionState.DISCONNECTED,
    );
  }, []);

  const isWalletConnected =
    walletConnectionState === WalletConnectionState.CONNECTED;

  const ctxValue = {
    isWalletConnected, // TODO: replace isWalletConnected with walletConnectionState to handle initial state
    walletConnectionState,
    setIsWalletConnected,
    utxos,
    ergBalance,
  };

  useEffect(() => {
    if (walletCookies.isSetConnected() && window.ergo_request_read_access) {
      window.ergo_request_read_access().then(setIsWalletConnected);
    }
  }, [isWalletConnected, setIsWalletConnected]);

  useEffect(() => {
    if (isWalletConnected) {
      fetchUtxos().then(setUtxos);
      ergo.get_balance(ERG_TOKEN_NAME).then(setErgBalance);
    }
  }, [isWalletConnected]);

  useInterval(() => {
    if (isWalletConnected) {
      fetchUtxos().then(setUtxos);
      ergo.get_balance(ERG_TOKEN_NAME).then(setErgBalance);
    }
  }, 10 * 1000);

  return (
    <WalletContext.Provider value={ctxValue}>{children}</WalletContext.Provider>
  );
};
