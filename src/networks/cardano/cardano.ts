import { PoolId } from '@ergolabs/ergo-dex-sdk/build/main/amm/types';
import { AssetAmount } from '@ergolabs/ergo-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { map, Observable, of } from 'rxjs';

import { ERG_DECIMALS } from '../../constants/erg';
import { Network, WalletState } from '../shared';

const ERGO_ID =
  '0000000000000000000000000000000000000000000000000000000000000001';

const nativeToken$: Observable<AssetInfo> = of({
  name: 'ADA',
  decimals: ERG_DECIMALS,
  id: ERGO_ID,
});

export const cardanoNetwork: Network = {
  nativeToken$,
  nativeTokenBalance$: of('0.001'),
  walletState$: of(WalletState.CONNECTED),
  connectWallet: () => {},
  getPoolById: () => of(undefined),
  getPoolByPair: () => of([]),
  isWalletLoading$: of(false),
  isWalletSetuped$: of(true),
  availablePools$: of([]),
  assets$: of([
    { name: 'ADA', id: '1', decimals: ERG_DECIMALS, description: 'ADA' },
    { name: 'wERG', id: '2', decimals: ERG_DECIMALS, description: 'wERG' },
    { name: 'Djed', id: '3', decimals: ERG_DECIMALS, description: 'Djed' },
    { name: 'GENS', id: '4', decimals: ERG_DECIMALS, description: 'GENS' },
  ]),
  getAssetById: (id: string) => of({} as any),
  getAssetsByPairAsset: (pairAssetId: string) =>
    cardanoNetwork.assets$.pipe(
      map((assets) => assets.filter((a) => a.id !== pairAssetId)),
    ),
  pools$: of([]),
  name: 'cardano',
};
