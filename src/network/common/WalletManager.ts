import { DateTime } from 'luxon';
import { ReactNode } from 'react';
import {
  catchError,
  distinctUntilChanged,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

import { localStorageManager } from '../../common/utils/localStorageManager';
import { Wallet, WalletState } from './Wallet';

interface WalletDescriptor {
  readonly name: string;
  readonly expDate: string;
}

export interface WalletManager<W extends Wallet> {
  setSelectedWallet: (w: W) => Observable<boolean | ReactNode>;
  getSelectedWallet: () => W | undefined;
  removeSelectedWallet: () => void;
  selectedWallet$: Observable<undefined | W>;
  selectedWalletState$: Observable<WalletState>;
  availableWallets: W[];
}

const isSelectedWalletValid = (wallet: WalletDescriptor): boolean =>
  DateTime.now().toUTC() < DateTime.fromISO(wallet.expDate).toUTC();

const toWalletDescriptor = (wallet: Wallet): WalletDescriptor => ({
  name: wallet.name,
  expDate: DateTime.now().toUTC().plus({ day: 2 }).toISODate(),
});

export const makeWalletManager = <W extends Wallet>(
  key: string,
  availableWallets: W[],
  getWalletConnectionCheck: (w: W) => Observable<boolean | ReactNode>,
): WalletManager<W> => {
  const toWalletContract = (name: string): W => {
    let wallet: W | undefined;

    if (name === 'Read-only Wallet') {
      wallet = availableWallets.find((w) => w.name === 'ErgoPay');
    } else {
      wallet = availableWallets.find((w) => w.name === name);
    }

    if (!wallet) {
      throw new Error(`unsupported wallet with name ${name}`);
    }

    return wallet;
  };

  const getCurrentWallet = (): W | undefined => {
    const currentWalletDescriptor =
      localStorageManager.get<WalletDescriptor>(key);

    if (!currentWalletDescriptor) {
      return undefined;
    }

    return currentWalletDescriptor
      ? toWalletContract(currentWalletDescriptor.name)
      : undefined;
  };

  const removeSelectedWallet = () => {
    const currenWallet = getCurrentWallet();

    if (currenWallet?.onDisconnect) {
      currenWallet.onDisconnect();
    }

    localStorageManager.remove(key);
  };

  const setSelectedWallet = (wallet: W) => {
    const prevWallet = getCurrentWallet();

    return getWalletConnectionCheck(wallet).pipe(
      tap((status) => {
        if (typeof status === 'boolean' && status) {
          prevWallet?.onDisconnect && prevWallet.onDisconnect();
          wallet.onConnect && wallet.onConnect();
          localStorageManager.set<WalletDescriptor>(
            key,
            toWalletDescriptor(wallet),
          );
        }
      }),
    );
  };

  const getSelectedWallet = (): W | undefined => {
    const selectedWallet = localStorageManager.get<WalletDescriptor>(key);

    if (selectedWallet && isSelectedWalletValid(selectedWallet)) {
      return toWalletContract(selectedWallet.name);
    }
    return undefined;
  };

  const selectedWallet$ = localStorageManager.getStream<W>(key).pipe(
    map((ergoWalletDescriptor) => {
      if (!ergoWalletDescriptor) {
        return undefined;
      }
      return toWalletContract(ergoWalletDescriptor.name);
    }),
    publishReplay(1),
    refCount(),
  );

  const selectedWalletState$: Observable<WalletState> = selectedWallet$.pipe(
    switchMap((selectedWallet) => {
      if (!selectedWallet) {
        return of(WalletState.NOT_CONNECTED);
      }
      return getWalletConnectionCheck(selectedWallet).pipe(
        map((connectionStatus) =>
          typeof connectionStatus === 'boolean' && connectionStatus
            ? WalletState.CONNECTED
            : WalletState.NOT_CONNECTED,
        ),
        startWith(WalletState.CONNECTING),
        catchError(() => of(WalletState.NOT_CONNECTED)),
        distinctUntilChanged(),
        publishReplay(1),
        refCount(),
      );
    }),
  );

  return {
    removeSelectedWallet,
    setSelectedWallet,
    getSelectedWallet,
    availableWallets,
    selectedWallet$,
    selectedWalletState$,
  };
};
