import {
  AmmPool,
  makeNativePools,
  makePools,
  NetworkPools,
  PoolId,
} from '@ergolabs/ergo-dex-sdk';
import { ErgoBox, ergoBoxFromProxy } from '@ergolabs/ergo-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { find, uniqBy } from 'lodash';
import {
  combineLatest,
  defer,
  distinctUntilChanged,
  filter,
  from,
  iif,
  interval,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  startWith,
  Subject,
  switchMap,
  zip,
} from 'rxjs';

import { ERG_DECIMALS, ERG_TOKEN_NAME } from '../../constants/erg';
import { explorer } from '../../services/explorer';
import { walletCookies } from '../../utils/cookies';
import { getListAvailableTokens } from '../../utils/getListAvailableTokens';
import { renderFractions } from '../../utils/math';
import { Network, WalletState } from '../shared';

const UPDATE_TIME = 5 * 1000;
const ERGO_ID =
  '0000000000000000000000000000000000000000000000000000000000000000';

const nativeToken$: Observable<AssetInfo> = of({
  name: ERG_TOKEN_NAME,
  decimals: ERG_DECIMALS,
  id: ERGO_ID,
});

const updateWalletState = new Subject();

export const walletState$ = updateWalletState.pipe(
  startWith(undefined),
  switchMap(() =>
    iif(
      () => walletCookies.isSetConnected() && !!window.ergo_request_read_access,
      from(window.ergo_request_read_access()).pipe(
        map((value) =>
          value ? WalletState.CONNECTED : WalletState.CONNECTING,
        ),
        startWith(WalletState.CONNECTING),
      ),
      of(WalletState.NOT_CONNECTED),
    ),
  ),
  distinctUntilChanged(),
  publishReplay(1),
  refCount(),
);

export const connectWallet = () => {
  updateWalletState.next(undefined);
};

export const isWalletSetuped$ = walletState$.pipe(
  map(
    (state) =>
      state === WalletState.CONNECTED || state === WalletState.CONNECTING,
  ),
  publishReplay(1),
  refCount(),
);

export const appTick$ = walletState$.pipe(
  filter((state) => state === WalletState.CONNECTED),
  switchMap(() => interval(UPDATE_TIME).pipe(startWith(0))),
  publishReplay(1),
  refCount(),
);

export const utxos$ = appTick$.pipe(
  switchMap(() => from(ergo.get_utxos())),
  map((bs) => bs?.map((b) => ergoBoxFromProxy(b))),
  map((data) => data ?? []),
  publishReplay(1),
  refCount(),
);

export const nativeTokenBalance$ = appTick$.pipe(
  switchMap(() => from(ergo.get_balance(ERG_TOKEN_NAME))),
  map((balance) => renderFractions(balance, ERG_DECIMALS)),
  publishReplay(1),
  refCount(),
);

export const isWalletLoading$ = combineLatest([
  utxos$,
  nativeTokenBalance$,
]).pipe(
  map(() => false),
  startWith(true),
  publishReplay(1),
  refCount(),
);

export const getTokenBalance = (tokenId: string): Observable<number> =>
  isWalletSetuped$.pipe(
    filter(Boolean),
    switchMap(() =>
      from(
        tokenId === ERGO_ID
          ? ergo.get_balance(ERG_TOKEN_NAME)
          : ergo.get_balance(tokenId),
      ),
    ),
    map((amount) => +renderFractions(amount, ERG_DECIMALS)),
  );

export const networkPools = (): NetworkPools => makePools(explorer);
export const nativeNetworkPools = (): NetworkPools => makeNativePools(explorer);

const BlacklistedPoolId =
  'bee300e9c81e48d7ab5fc29294c7bbb536cf9dcd9c91ee3be9898faec91b11b6';

const utxosToTokenIds = (utxos: ErgoBox[]): string[] =>
  Object.values(getListAvailableTokens(utxos)).map((token) => token.tokenId);

const filterPoolsByTokenIds = (
  pools: AmmPool[],
  tokenIds: string[],
): AmmPool[] => pools.filter((p) => tokenIds.includes(p.lp.asset.id));

const nativeNetworkPools$ = defer(() =>
  from(nativeNetworkPools().getAll({ limit: 100, offset: 0 })),
).pipe(
  map(([pools]) => pools),
  publishReplay(1),
  refCount(),
);

const networkPools$ = defer(() =>
  from(networkPools().getAll({ limit: 100, offset: 0 })),
).pipe(
  map(([pools]) => pools),
  publishReplay(1),
  refCount(),
);

export const pools$ = combineLatest([nativeNetworkPools$, networkPools$]).pipe(
  map(([nativeNetworkPools, networkPools]) =>
    nativeNetworkPools
      .concat(networkPools)
      .filter((p) => p.id != BlacklistedPoolId),
  ),
  publishReplay(1),
  refCount(),
);

const availableNativeNetworkPools$ = utxos$.pipe(
  map(utxosToTokenIds),
  switchMap((tokensIds) =>
    from(
      nativeNetworkPools().getByTokensUnion(tokensIds, {
        limit: 500,
        offset: 0,
      }),
    ).pipe(map(([pools]) => filterPoolsByTokenIds(pools, tokensIds))),
  ),
  publishReplay(1),
  refCount(),
);

const availableNetworkPools$ = utxos$.pipe(
  map(utxosToTokenIds),
  switchMap((tokensIds) =>
    from(
      networkPools().getByTokensUnion(tokensIds, {
        limit: 500,
        offset: 0,
      }),
    ).pipe(map(([pools]) => filterPoolsByTokenIds(pools, tokensIds))),
  ),
  publishReplay(1),
  refCount(),
);

export const availablePools$: Observable<AmmPool[]> = zip([
  availableNativeNetworkPools$,
  availableNetworkPools$,
]).pipe(
  map(([nativePools, pools]) => nativePools.concat(pools)),
  startWith([]),
  publishReplay(1),
  refCount(),
);

export const getPoolById = (poolId: PoolId): Observable<AmmPool | undefined> =>
  availablePools$.pipe(
    map((pools) => pools.find((position) => position.id === poolId)),
  );

const byPair = (xId: string, yId: string) => (p: AmmPool) =>
  (p.assetX.id === xId || p.assetY.id === xId) &&
  (p.assetX.id === yId || p.assetY.id === yId);

export const getPoolByPair = (
  xId: string,
  yId: string,
): Observable<AmmPool[]> =>
  pools$.pipe(
    map((pools) => pools.filter(byPair(xId, yId))),
    publishReplay(1),
    refCount(),
  );

export const assets$ = pools$.pipe(
  map((pools) => pools.flatMap((p) => [p.assetX, p.assetY])),
  map((assets) => uniqBy(assets, 'id')),
  publishReplay(1),
  refCount(),
);

export const getAssetById = (id: string): Observable<AssetInfo> =>
  assets$.pipe(map((assets) => find(assets, ['id', id])!));

export const getAssetsByPairAsset = (pairAssetId: string) =>
  pools$.pipe(
    map((pools) =>
      pools.filter(
        (p) => p.assetX.id === pairAssetId || p.assetY.id === pairAssetId,
      ),
    ),
    map((pools) =>
      pools
        .flatMap((p) => [
          p.assetX.id !== pairAssetId ? p.assetX : undefined,
          p.assetY.id !== pairAssetId ? p.assetY : undefined,
        ])
        .filter<AssetInfo>(Boolean as any),
    ),
    map((assets) => uniqBy(assets, 'id')),
    publishReplay(1),
    refCount(),
  );

export const ergoNetwork: Network = {
  nativeToken$,
  nativeTokenBalance$,
  walletState$,
  connectWallet,
  getPoolByPair,
  getPoolById,
  isWalletLoading$,
  isWalletSetuped$,
  assets$,
  getAssetById,
  getAssetsByPairAsset,
  pools$,
  availablePools$,
  name: 'ergo',
};
