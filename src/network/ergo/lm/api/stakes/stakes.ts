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

const MAX_VLQ_TOKEN_EMISSION = BigInt(0x7fffffffffffffff) - 2n;

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

export const rawStakesWithRedeemerKey$: Observable<RawStakeWithRedeemerKey[]> =
  availableTokensDataWithNft$.pipe(
    switchMap((availableTokensData) => {
      const stakeAssets = availableTokensData.filter(isStakeAsset);

      if (!stakeAssets.length) {
        return of([]);
      }

      return from(
        getStakesHistory().searchByKeys(stakeAssets.map(stakeAssetToId), {
          limit: 500,
          offset: 0,
        }),
      ).pipe(
        map((res) => res[0]),
        map((stakes) =>
          stakes.map((stake) => {
            const stakeAsset = stakeAssets.find(
              (sa) => sa[1].id === stake.bundleKeyAsset.asset.id,
            );
            return {
              ...stake,
              redeemerKey: new Currency(stakeAsset![0], stakeAsset![1]),
            };
          }),
        ),
      );
    }),
    publishReplay(1),
    refCount(),
  );
