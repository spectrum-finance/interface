import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import {
  combineLatest,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { ERG_DECIMALS } from '../../constants/erg';
import { useObservable } from '../../hooks/useObservable';
import {
  getListAvailableTokens,
  isAsset,
} from '../../utils/getListAvailableTokens';
import { fractionsToNum, parseUserInputToFractions } from '../../utils/math';
import { assets$ } from './assets';
import { nativeTokenBalance$, utxos$ } from './core';
import { selectedNetwork$ } from './network';

const ERGO_ID =
  '0000000000000000000000000000000000000000000000000000000000000000';

export class Balance {
  private mapTokenIdToBalance = new Map<string, number>();

  constructor(tokens: [bigint, AssetInfo][]) {
    this.mapTokenIdToBalance = new Map(
      tokens.map(([amount, info]) => [
        info.id,
        fractionsToNum(amount, info.decimals),
      ]),
    );
  }

  get(token: string | AssetInfo) {
    if (typeof token === 'string') {
      return this.mapTokenIdToBalance.get(token) || 0;
    }
    if (isAsset(token)) {
      return this.mapTokenIdToBalance.get(token.tokenId) || 0;
    }
    return this.mapTokenIdToBalance.get(token.id) || 0;
  }

  toArray() {
    return this.mapTokenIdToBalance.entries();
  }
}

export const ergoWalletBalance$ = combineLatest([
  nativeTokenBalance$.pipe(
    map((balance) => parseUserInputToFractions(balance, ERG_DECIMALS)),
  ),
  utxos$.pipe(switchMap(() => assets$)),
  utxos$.pipe(map((utxos) => Object.values(getListAvailableTokens(utxos)))),
]).pipe(
  map(([nativeTokenBalance, assets, boxAssets]) =>
    boxAssets
      .map<[bigint, AssetInfo]>((ba) => [
        ba.amount,
        assets.find((a) => a.id === ba.tokenId)!,
      ])
      .concat([[nativeTokenBalance, assets.find((a) => a.id === ERGO_ID)!]])
      .filter((i) => !!i[1]),
  ),
  map((data) => new Balance(data)),
  publishReplay(1),
  refCount(),
);

export const walletBalance$ = selectedNetwork$.pipe(
  switchMap((n) =>
    n.name === 'ergo'
      ? ergoWalletBalance$
      : of(
          new Balance([
            [
              12940000000n,
              {
                name: 'ADA',
                id: '1',
                decimals: ERG_DECIMALS,
                description: 'Cardano',
              },
            ],
            [
              200000000000n,
              {
                name: 'wErg',
                id: '2',
                decimals: ERG_DECIMALS,
                description: 'Wrapped ERG',
              },
            ],
            [
              3000000000n,
              {
                name: 'DjedUSD',
                id: '3',
                decimals: ERG_DECIMALS,
                description: 'COTI',
              },
            ],
            [
              1000000000000n,
              {
                name: 'GENS',
                id: '4',
                decimals: ERG_DECIMALS,
                description: 'Genius Yield',
              },
            ],
          ]),
        ),
  ),
);

walletBalance$.subscribe(() => {});

export const useWalletBalance = () =>
  useObservable(walletBalance$, new Balance([]));

export const getBalanceByTokenId = (
  token: string | AssetInfo,
): Observable<number> =>
  walletBalance$.pipe(
    map((balance) => balance.get(token)),
    publishReplay(1),
    refCount(),
  );
