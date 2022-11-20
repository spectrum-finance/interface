import axios from 'axios';
import { DateTime } from 'luxon';
import {
  from,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
  tap,
} from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { Currency } from '../../../../common/models/Currency';
import { getAddresses } from '../addresses/addresses';
import { spfAsset } from '../networkAsset/networkAsset';

export interface RawCohort {
  readonly cohort: string;
  readonly spfReward: number;
}

export interface Cohort {
  readonly cohort: string;
  readonly spfReward: Currency;
}

export interface RawClaimSpfReward {
  readonly cohorts: RawCohort[];
}

export interface ClaimSpfReward {
  readonly cohorts: Cohort[];
  readonly total: Currency;
}

export const claimSpfReward$: Observable<ClaimSpfReward> = getAddresses().pipe(
  switchMap((addresses) =>
    from(
      axios.post<RawClaimSpfReward>(
        `${applicationConfig.networksSettings.ergo.spfFaucet}reward`,
        { addresses },
      ),
    ),
  ),
  map((res) => res.data),
  map((data) => {
    const cohorts = data.cohorts.map((c) => ({
      cohort: c.cohort,
      spfReward: new Currency(c.spfReward.toString(), spfAsset),
    }));

    return {
      cohorts,
      total: cohorts.reduce(
        (sum, item) => sum.plus(item.spfReward),
        new Currency(0n, spfAsset),
      ),
    };
  }),
  publishReplay(1),
  refCount(),
);
