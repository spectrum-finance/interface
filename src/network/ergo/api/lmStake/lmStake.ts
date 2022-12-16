import { makeStakes } from '@ergolabs/ergo-dex-sdk';
import { Stake } from '@ergolabs/ergo-dex-sdk/build/main/lqmining/models/stake';
import { StakeFromBox } from '@ergolabs/ergo-dex-sdk/build/main/lqmining/parsers/stakeFromBox';
import { Stakes } from '@ergolabs/ergo-dex-sdk/build/main/lqmining/services/stakes';
import { from, map, Observable, of, switchMap } from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { explorer } from '../../../../services/explorer';
import { availableTokensDataWithNft$ } from '../balance/common';

const MAX_VLQ_TOKEN_EMISSION = BigInt(0x7fffffffffffffff) - 2n;

let stakes: Stakes;

const getStakes = () => {
  if (!stakes) {
    stakes = makeStakes(explorer, new StakeFromBox());
  }
  return stakes;
};

export interface ExtendedStake extends Stake {
  readonly redeemerKey: Currency;
}

export const stakes$: Observable<ExtendedStake[]> =
  availableTokensDataWithNft$.pipe(
    switchMap((availableTokensData) => {
      const stakeAssets = availableTokensData.filter(
        ([amount, asset]) => MAX_VLQ_TOKEN_EMISSION === amount && !!asset,
      );

      if (!stakeAssets.length) {
        return of([]);
      }

      return from(
        getStakes().searchByKeys(
          stakeAssets.map(([, asset]) => asset.id),
          { limit: 500, offset: 0 },
        ),
      ).pipe(
        map((res) =>
          res[0].map((item) => {
            const stakeAsset = stakeAssets.find(
              (sa) => sa[1].id === item.bundleKeyAsset.asset.id,
            );
            return {
              ...item,
              redeemerKey: new Currency(stakeAsset![0], stakeAsset![1]),
            };
          }),
        ),
      );
    }),
  );
