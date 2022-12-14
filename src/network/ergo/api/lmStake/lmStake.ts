import { makeStakes } from '@ergolabs/ergo-dex-sdk';
import { StakeFromBox } from '@ergolabs/ergo-dex-sdk/build/main/lqmining/parsers/stakeFromBox';
import { Stakes } from '@ergolabs/ergo-dex-sdk/build/main/lqmining/services/stakes';
import { from, of, switchMap } from 'rxjs';

import { explorer } from '../../../../services/explorer';
import { availableTokensData$ } from '../balance/common';

const MAX_VLQ_TOKEN_EMISSION = BigInt(0x7fffffffffffffff);

let stakes: Stakes;

const getStakes = () => {
  if (!stakes) {
    stakes = makeStakes(explorer, new StakeFromBox());
  }
  return stakes;
};

export const stakes$ = availableTokensData$
  .pipe(
    switchMap((availableTokensData) => {
      const stakeAssets = availableTokensData
        .filter(
          ([amount, asset]) => MAX_VLQ_TOKEN_EMISSION === amount && !!asset,
        )
        .map(([, asset]) => asset.id);

      if (!stakeAssets.length) {
        return of([]);
      }

      return from(
        getStakes().searchByKeys(
          availableTokensData
            .filter(
              ([amount, asset]) => MAX_VLQ_TOKEN_EMISSION === amount && !!asset,
            )
            .map(([, asset]) => asset.id),
          { limit: 2000, offset: 0 },
        ),
      );
    }),
  )
  .subscribe((res) => console.log('here', res));
