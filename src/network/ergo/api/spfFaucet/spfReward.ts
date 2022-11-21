import axios from 'axios';
import {
  from,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
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

export interface RawSpfReward {
  readonly cohorts: RawCohort[];
}

export interface SpfReward {
  readonly cohorts: Cohort[];
  readonly total: Currency;
}

export const spfReward$: Observable<SpfReward> = getAddresses().pipe(
  switchMap((addresses) =>
    from(
      axios.post<RawSpfReward>(
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
