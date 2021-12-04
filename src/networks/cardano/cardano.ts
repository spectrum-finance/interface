import { AmmPool } from '@ergolabs/ergo-dex-sdk';
import { PoolId } from '@ergolabs/ergo-dex-sdk/build/main/amm/types';
import { AssetAmount } from '@ergolabs/ergo-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { map, Observable, of, tap } from 'rxjs';

import { ERG_DECIMALS } from '../../constants/erg';
import { Network, WalletState } from '../shared';

const ERGO_ID = '1';

const nativeToken$: Observable<AssetInfo> = of({
  name: 'ADA',
  decimals: ERG_DECIMALS,
  id: ERGO_ID,
});

export const pools = [
  new AmmPool(
    '1',
    new AssetAmount(
      { name: 'ADA_wERG', id: '12', decimals: ERG_DECIMALS, description: '' },
      100000000n,
    ),
    new AssetAmount(
      { name: 'ADA', id: '1', decimals: ERG_DECIMALS, description: '' },
      100000000n,
    ),
    new AssetAmount(
      { name: 'wErg', id: '2', decimals: ERG_DECIMALS, description: '' },
      100000000n,
    ),
    997,
  ),
  new AmmPool(
    '2',
    new AssetAmount(
      { name: 'ADA_Djed', id: '13', decimals: ERG_DECIMALS, description: '' },
      100000000n,
    ),
    new AssetAmount(
      { name: 'ADA', id: '1', decimals: ERG_DECIMALS, description: '' },
      100000000n,
    ),
    new AssetAmount(
      { name: 'Djed', id: '3', decimals: ERG_DECIMALS, description: '' },
      100000000n,
    ),
    997,
  ),
  new AmmPool(
    '2',
    new AssetAmount(
      { name: 'ADA_GENS', id: '14', decimals: ERG_DECIMALS, description: '' },
      100000000n,
    ),
    new AssetAmount(
      { name: 'ADA', id: '1', decimals: ERG_DECIMALS, description: '' },
      100000000n,
    ),
    new AssetAmount(
      { name: 'GENS', id: '4', decimals: ERG_DECIMALS, description: '' },
      100000000n,
    ),
    997,
  ),
];

export const getPoolByPair = (xId: string, yId: string) => {
  return of(
    pools.filter(
      (p) =>
        (p.assetX.id === xId && p.assetY.id === yId) ||
        (p.assetY.id === xId && p.assetX.id === yId),
    ),
  );
};

export const cardanoNetwork: Network = {
  nativeToken$,
  nativeTokenBalance$: of('10'),
  walletState$: of(WalletState.CONNECTED),
  connectWallet: () => {},
  getPoolById: (id: string) => {
    return cardanoNetwork.availablePools$.pipe(
      map((pools) => {
        return pools.find((p) => p.id === id);
      }),
    );
  },
  getPoolByPair,
  isWalletLoading$: of(false),
  isWalletSetuped$: of(true),
  availablePools$: of(pools),
  assets$: of([
    { name: 'ADA', id: '1', decimals: ERG_DECIMALS, description: 'Cardano' },
    {
      name: 'wERG',
      id: '2',
      decimals: ERG_DECIMALS,
      description: 'Wrapped ERG',
    },
    { name: 'Djed', id: '3', decimals: ERG_DECIMALS, description: 'COTI' },
    {
      name: 'GENS',
      id: '4',
      decimals: ERG_DECIMALS,
      description: 'Genius Yield',
    },
  ]),
  getAssetById: (id: string) => of({} as any),
  getAssetsByPairAsset: (pairAssetId: string) =>
    cardanoNetwork.assets$.pipe(
      map((assets) => assets.filter((a) => a.id !== pairAssetId)),
    ),
  pools$: of([]),
  name: 'cardano',
};
