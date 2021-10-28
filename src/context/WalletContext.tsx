import { ErgoBox, ergoBoxFromProxy } from '@ergolabs/ergo-sdk';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { ERG_DECIMALS, ERG_TOKEN_NAME } from '../constants/erg';
import { useInterval } from '../hooks/useInterval';
import { walletCookies } from '../utils/cookies';
import { renderFractions } from '../utils/math';

export enum WalletConnectionState {
  NOT_CONNECTED, // initial state
  CONNECTED,
  DISCONNECTED,
}

export type WalletContextType = {
  isWalletConnected: boolean; // @deprecated in favour of walletConnectionState
  walletConnectionState: WalletConnectionState;
  utxos: ErgoBox[] | undefined;
  setIsWalletConnected: (isWalletConnected: boolean) => void;
  ergBalance: string | undefined;
  isWalletLoading: boolean;
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
  isWalletLoading: false,
});

export const useWallet = (): WalletContextType => useContext(WalletContext);

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
  const [isWalletLoading, setIsWalletLoading] = useState<boolean>(false);

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
    isWalletLoading,
  };

  useEffect(() => {
    setIsWalletLoading(true);
    if (walletCookies.isSetConnected() && window.ergo_request_read_access) {
      window
        .ergo_request_read_access()
        .then(setIsWalletConnected)
        .finally(() => setIsWalletLoading(false));
    }
  }, [isWalletConnected, setIsWalletConnected]);

  useEffect(() => {
    setIsWalletLoading(true);
    if (isWalletConnected) {
      Promise.all([
        fetchUtxos().then(setUtxos),
        ergo.get_balance(ERG_TOKEN_NAME).then((balance) => {
          setErgBalance(renderFractions(balance, ERG_DECIMALS));
        }),
      ]).finally(() => setIsWalletLoading(false));
    }
  }, [isWalletConnected]);

  useInterval(() => {
    if (isWalletConnected) {
      fetchUtxos().then(setUtxos);
      ergo.get_balance(ERG_TOKEN_NAME).then((balance) => {
        setErgBalance(renderFractions(balance, ERG_DECIMALS));
      });
    }
  }, 10 * 1000);

  return (
    <WalletContext.Provider value={ctxValue}>{children}</WalletContext.Provider>
  );
};
