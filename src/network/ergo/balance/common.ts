import { ErgoBox } from '@ergolabs/ergo-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import {
  combineLatest,
  debounceTime,
  defaultIfEmpty,
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

const toListAvailableTokens = (utxos: ErgoBox[]): Asset[] =>
  Object.values(getListAvailableTokens(utxos));

export const availableTokensData$: Observable<[bigint, AssetInfo][]> = utxos$
  .pipe(map(toListAvailableTokens))
  .pipe(
    debounceTime(200),
    switchMap((boxAssets) =>
      combineLatest<[bigint, AssetInfo][]>(
        boxAssets.map((ba) =>
          from(explorer.getFullTokenInfo(ba.tokenId)).pipe(
            map((assetInfo) => {
              return [ba.amount, assetInfo as AssetInfo];
            }),
          ),
        ),
      ).pipe(defaultIfEmpty([])),
    ),
    map((availableTokensData) =>
      availableTokensData.filter(([, assetInfo]) => !!assetInfo),
    ),
    publishReplay(1),
    refCount(),
  );
