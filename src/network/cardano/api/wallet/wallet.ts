import { ReactNode } from 'react';
import { filter, map, Observable, publishReplay, refCount } from 'rxjs';

import { WalletState, WalletSupportedFeatures } from '../../../common/Wallet';
import { makeWalletManager } from '../../../common/WalletManager';
import { CardWallet } from './cardWallet/cardWallet';
import { CardanoWalletContract } from './common/CardanoWalletContract';
import { Eternl } from './eternl/eternl';
import { Flint } from './flint/flint';
import { Gero } from './gero/gero';
import { Nami } from './nami/nami';

const CARDANO_SELECTED_WALLET_TOKEN = 'cardano-selected-wallet';

export const cardanoWalletManager = makeWalletManager<CardanoWalletContract>(
  CARDANO_SELECTED_WALLET_TOKEN,
  [Nami, Eternl, Gero, Flint, CardWallet],
  (w: CardanoWalletContract) => w.connectWallet(),
);

export const availableWallets: CardanoWalletContract[] =
  cardanoWalletManager.availableWallets;

export const selectedWallet$: Observable<CardanoWalletContract | undefined> =
  cardanoWalletManager.selectedWallet$;

export const supportedWalletFeatures$: Observable<WalletSupportedFeatures> =
  selectedWallet$.pipe(
    filter(Boolean),
    map((w) => w.walletSupportedFeatures),
    publishReplay(1),
    refCount(),
  );

export const walletState$: Observable<WalletState> =
  cardanoWalletManager.selectedWalletState$;

export const disconnectWallet = (): void =>
  cardanoWalletManager.removeSelectedWallet();

export const connectWallet = (
  w: CardanoWalletContract,
): Observable<boolean | ReactNode> => cardanoWalletManager.setSelectedWallet(w);
