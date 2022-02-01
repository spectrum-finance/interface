import { ErgoBox } from '@ergolabs/ergo-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import {
  combineLatest,
  debounceTime,
  from,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { explorer } from '../../../services/explorer';
import { utxos$ } from '../../../services/new/core';
import {
  Asset,
  getListAvailableTokens,
} from '../../../utils/getListAvailableTokens';
import { tokenLocks$ } from '../common/tokenLocks';

const toListAvailableTokens = (utxos: ErgoBox[]): Asset[] =>
  Object.values(getListAvailableTokens(utxos));

export const availableTokensData$: Observable<[bigint, AssetInfo][]> =
  combineLatest([utxos$.pipe(map(toListAvailableTokens)), tokenLocks$]).pipe(
    debounceTime(200),
    switchMap(([boxAssets, tokenLocks]) =>
      combineLatest<[bigint, AssetInfo][]>(
        boxAssets.map((ba) =>
          from(explorer.getFullTokenInfo(ba.tokenId)).pipe(
            map((assetInfo) => {
              const locks = tokenLocks.filter(
                (tl) => tl.lockedAsset.asset.id === assetInfo?.id,
              );

              return [
                locks.reduce((acc, l) => acc + l.lockedAsset.amount, ba.amount),
                assetInfo as AssetInfo,
              ];
            }),
          ),
        ),
      ).pipe(
        map((availableTokensData) => {
          const fullLockedPositions: [bigint, AssetInfo][] = tokenLocks
            .filter(
              (tl) =>
                !availableTokensData.some(
                  (atd) => atd[1].id === tl.lockedAsset.asset.id,
                ),
            )
            .map((tl) => [tl.lockedAsset.amount, tl.lockedAsset.asset]);

          return availableTokensData.concat(fullLockedPositions);
        }),
      ),
    ),
    map((availableTokensData) =>
      availableTokensData.filter(([, assetInfo]) => !!assetInfo),
    ),
    publishReplay(1),
    refCount(),
  );
