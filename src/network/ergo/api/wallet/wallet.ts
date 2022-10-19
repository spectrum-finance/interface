import { ReactNode } from 'react';
import { filter, map, Observable, publishReplay, refCount } from 'rxjs';

import { WalletState, WalletSupportedFeatures } from '../../../common/Wallet';
import { makeWalletManager } from '../../../common/WalletManager';
import { ErgoWalletContract } from './common/ErgoWalletContract';
import { Nautilus } from './nautilus/nautilus';
import { ReadonlyWallet } from './readonly/readonly';

const ERGO_SELECTED_WALLET_TOKEN = 'ergo-selected-wallet';

export const ergoWalletManager = makeWalletManager<ErgoWalletContract>(
  ERGO_SELECTED_WALLET_TOKEN,
  [Nautilus, ReadonlyWallet],
  (w: ErgoWalletContract) => w.connectWallet(),
);

export const availableWallets: ErgoWalletContract[] =
  ergoWalletManager.availableWallets;

export const selectedWallet$: Observable<ErgoWalletContract | undefined> =
  ergoWalletManager.selectedWallet$;

export const supportedWalletFeatures$: Observable<WalletSupportedFeatures> =
  selectedWallet$.pipe(
    filter(Boolean),
    map((w) => w.walletSupportedFeatures),
    publishReplay(1),
    refCount(),
  );

export const walletState$: Observable<WalletState> =
  ergoWalletManager.selectedWalletState$;

export const disconnectWallet = (): void =>
  ergoWalletManager.removeSelectedWallet();

export const connectWallet = (
  w: ErgoWalletContract,
): Observable<boolean | ReactNode> => ergoWalletManager.setSelectedWallet(w);
