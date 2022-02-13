import { ErgoBox } from '@ergolabs/ergo-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import {
  combineLatest,
  defaultIfEmpty,
  from,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { explorer } from '../../../services/explorer';
import {
  Asset,
  getListAvailableTokens,
} from '../../../utils/getListAvailableTokens';
import { utxos$ } from '../common/utxos';

const toListAvailableTokens = (utxos: ErgoBox[]): Asset[] =>
  Object.values(getListAvailableTokens(utxos));

export const availableTokensData$: Observable<[bigint, AssetInfo][]> =
  utxos$.pipe(
    map(toListAvailableTokens),
    switchMap((boxAssets) =>
      combineLatest<[bigint, AssetInfo][]>(
        boxAssets.map((ba) =>
          from(explorer.getFullTokenInfo(ba.tokenId)).pipe(
            map((assetInfo) => [ba.amount, assetInfo as AssetInfo]),
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
