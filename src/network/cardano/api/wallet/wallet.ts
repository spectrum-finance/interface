import { ReactNode } from 'react';
import { filter, map, Observable, publishReplay, refCount } from 'rxjs';

import { WalletState, WalletSupportedFeatures } from '../../../common/Wallet';
import { makeWalletManager } from '../../../common/WalletManager';
import { cardanoNetworkData } from '../../utils/cardanoNetworkData';
import { CardanoWalletContract } from './common/CardanoWalletContract';
import { Eternl } from './eternl/eternl';
import { Exodus } from './exodus/exodus.tsx';
import { Flint } from './flint/flint.tsx';
import { Gero } from './gero/gero';
import { Lace } from './lace/lace.tsx';
import { Nami } from './nami/nami';
import { Nufi } from './nufi/nufi.tsx';
import { Typhon } from './typhon/typhon.tsx';
import { WalletConnect } from './walletConnect/walletConnect.tsx';
import { Yoroi } from './yoroi/eternl.tsx';

const CARDANO_SELECTED_WALLET_TOKEN = cardanoNetworkData.walletKey;

export const cardanoWalletManager = makeWalletManager<CardanoWalletContract>(
  CARDANO_SELECTED_WALLET_TOKEN,
  [Nami, Eternl, Lace, Flint, WalletConnect, Nufi, Gero, Typhon, Yoroi, Exodus],
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
