import { makeStakes } from '@ergolabs/ergo-dex-sdk';
import { Stake } from '@ergolabs/ergo-dex-sdk/build/main/lqmining/models/stake';
import { StakeFromBox } from '@ergolabs/ergo-dex-sdk/build/main/lqmining/parsers/stakeFromBox';
import { Stakes } from '@ergolabs/ergo-dex-sdk/build/main/lqmining/services/stakes';
import {
  from,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { AssetInfo } from '../../../../../common/models/AssetInfo';
import { Currency } from '../../../../../common/models/Currency';
import { explorer } from '../../../../../services/explorer';
import { availableTokensDataWithNft$ } from '../../../api/balance/common';

/*
 * Max token emission in the Ergo blockchain is Long.MaxValue = 9223372036854775807L (Scala)
 * In JavaScript this value is represented as 9223372036854775806n
 */
const MAX_VLQ_TOKEN_EMISSION = 9223372036854775806n;

const MAX_STAKES_PER_PAGE = 500;

let stakesHistory: Stakes;

const getStakesHistory = () => {
  if (!stakesHistory) {
    stakesHistory = makeStakes(explorer, new StakeFromBox());
  }
  return stakesHistory;
};

const isStakeAsset = ([amount, asset]: [bigint, AssetInfo]): boolean =>
  MAX_VLQ_TOKEN_EMISSION === amount && !!asset;

const stakeAssetToId = ([, asset]: [bigint, AssetInfo]): string => asset.id;

export interface RawStakeWithRedeemerKey extends Stake {
  readonly redeemerKey: Currency;
}

const toRawStakeWithRedeemerKey = (
  rawStake: Stake,
  stakeAssets: [bigint, AssetInfo][],
): RawStakeWithRedeemerKey => {
  const stakeAsset = stakeAssets.find(
    (sa) => sa[1].id === rawStake.bundleKeyAsset.asset.id,
  );
  return {
    ...rawStake,
    redeemerKey: new Currency(stakeAsset![0], stakeAsset![1]),
  };
};

const loadStakes = (assets: string[], offset = 0): Observable<Stake[]> =>
  from(
    getStakesHistory().searchByKeys(assets, {
      limit: MAX_STAKES_PER_PAGE,
      offset,
    }),
  ).pipe(
    switchMap(([stakes, count]) =>
      count === MAX_STAKES_PER_PAGE
        ? loadStakes(assets, offset + MAX_STAKES_PER_PAGE).pipe(
            map((childStakes) => stakes.concat(childStakes)),
          )
        : of(stakes),
    ),
  );

export const rawStakesWithRedeemerKey$: Observable<RawStakeWithRedeemerKey[]> =
  availableTokensDataWithNft$.pipe(
    switchMap((availableTokensData) => {
      const stakeAssets = availableTokensData.filter(isStakeAsset);

      if (!stakeAssets.length) {
        return of([]);
      }

      return loadStakes(stakeAssets.map(stakeAssetToId)).pipe(
        map((stakes) =>
          stakes.map((stake) => toRawStakeWithRedeemerKey(stake, stakeAssets)),
        ),
      );
    }),
    publishReplay(1),
    refCount(),
  );
