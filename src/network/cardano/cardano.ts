import { Observable, of } from 'rxjs';

import { AmmPool } from '../../common/models/AmmPool';
import { Balance } from '../../common/models/Balance';
import { Currency } from '../../common/models/Currency';
import { TxId } from '../../common/types';
import { Network } from '../common/Network';
import { ammPools$ } from './api/ammPool/ammPool';
import { networkAsset } from './api/networkAsset/networkAsset';
import { CardanoWalletContract } from './api/wallet/common/CardanoWalletContract';
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
  ammPools$,
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
  swap(pool: AmmPool, from: Currency, to: Currency): Observable<TxId> {
    return of('');
  },
};
