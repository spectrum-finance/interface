import { of } from 'rxjs';

import { Balance } from '../../common/models/Balance';
import { Currency } from '../../common/models/Currency';
import { Network } from '../common/Network';
import { networkAsset } from './api/networkAsset/networkAsset';
import { CardanoWalletContract } from './api/wallet/CardanoWalletContract';
import {
  availableWallets,
  connectWallet,
  disconnectWallet,
  selectedWallet$,
  supportedWalletFeatures$,
  walletState$,
} from './api/wallet/wallet';

export const cardanoNetwork: Network<CardanoWalletContract> = {
  name: 'cardano',
  networkAsset,
  networkAssetBalance$: of(new Currency(0n, networkAsset)),
  assetBalance$: of(new Balance([])),
  lpBalance$: of(new Balance([])),
  locks$: of([]),
  positions$: of([]),
  ammPools$: of([]),
  getAddresses: () => of([]),
  getUsedAddresses: () => of(undefined),
  getUnusedAddresses: () => of(undefined),
  txHistoryManager: {} as any,
  connectWallet: connectWallet,
  disconnectWallet: disconnectWallet,
  availableWallets: availableWallets,
  walletState$: walletState$,
  selectedWallet$: selectedWallet$,
  supportedFeatures$: supportedWalletFeatures$,
};
