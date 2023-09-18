import { ReactNode } from 'react';
import {
  BehaviorSubject,
  filter,
  from,
  map,
  Observable,
  publishReplay,
  refCount,
} from 'rxjs';

import { WalletState, WalletSupportedFeatures } from '../../../common/Wallet';
import { patchSettings } from '../../settings/settings';
import {
  cardanoNetworkData,
  currentNetwork,
} from '../../utils/cardanoNetworkData';
import { AdditionalData } from './common/AdditionalData';
import { CardanoNetwork } from './common/old/CardanoWalletContract';
import { Wallet } from './common/Wallet';
import {
  createWalletManager,
  LocalStorageCacheStrategy,
} from './common/WalletManager';
import { Eternl } from './eternl/eternl';
import { Exodus } from './exodus/exodus.tsx';
import { Flint } from './flint/flint.tsx';
import { Gero } from './gero/gero';
import { Lace } from './lace/lace.tsx';
import { Nami } from './nami/nami';
import { Nufi } from './nufi/nufi.tsx';
// import { Typhon } from './typhon/typhon.tsx';
import { Vespr } from './vespr/vespr';
import { WalletConnect } from './walletConnect/walletConnect.tsx';
// import { Yoroi } from './yoroi/yoroi.tsx';

const localStorageCacheStrategy = new LocalStorageCacheStrategy(
  cardanoNetworkData.walletKey,
);
const walletStateUpdate$ = new BehaviorSubject(
  localStorageCacheStrategy.get()
    ? WalletState.CONNECTING
    : WalletState.NOT_CONNECTED,
);

const walletManager = createWalletManager({
  availableWallets: [
    Nami,
    Eternl,
    Lace,
    Flint,
    WalletConnect,
    Nufi,
    Gero,
    // Typhon,
    // Yoroi,
    Exodus,
    Vespr,
  ],
  cacheStrategy: localStorageCacheStrategy,
  network:
    currentNetwork === 'cardano_preview'
      ? CardanoNetwork.TESTNET
      : CardanoNetwork.MAINNET,
});

export const availableWallets: Wallet<AdditionalData>[] =
  walletManager.availableWallets as Wallet<AdditionalData>[];

export const selectedWallet$: Observable<Wallet<AdditionalData> | undefined> =
  new Observable<Wallet<AdditionalData> | undefined>((s) => {
    const unsubscribe = walletManager.onWalletChange((wallet) => {
      s.next(wallet as any);
      if (wallet) {
        walletStateUpdate$.next(WalletState.CONNECTED);
      } else {
        patchSettings({ wasAdaHandleModalOpened: false });
        walletStateUpdate$.next(WalletState.NOT_CONNECTED);
      }
    });
    s.next(walletManager.getActiveWallet());

    return () => unsubscribe();
  }).pipe(publishReplay(1), refCount());

export const supportedWalletFeatures$: Observable<WalletSupportedFeatures> =
  selectedWallet$.pipe(
    filter(Boolean),
    map((w: Wallet<AdditionalData>) => w.walletSupportedFeatures),
    publishReplay(1),
    refCount(),
  );

export const walletState$: Observable<WalletState> =
  walletStateUpdate$.asObservable();

export const disconnectWallet = (): void => walletManager.clearWallet();

export const connectWallet = (
  w: Wallet<any>,
): Observable<boolean | ReactNode> => from(walletManager.setActiveWallet(w));
