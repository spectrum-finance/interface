import axios from 'axios';
import {
  filter,
  from,
  map,
  Observable,
  of,
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
  readonly available: number;
  readonly claimed: number;
  readonly pending: number;
  readonly cohorts: RawCohort[];
}

export interface SpfReward {
  readonly cohorts: Cohort[];
  readonly total: Currency;
  readonly available: Currency;
  readonly claimed: Currency;
  readonly pending: Currency;
}

export const spfReward$: Observable<SpfReward> = getAddresses().pipe(
  filter((addresses) => !!addresses?.length),
  switchMap((addresses) =>
    !!addresses.length
      ? from(
          axios.post<RawSpfReward>(
            `${applicationConfig.networksSettings.ergo.spfFaucet}reward`,
            { addresses },
          ),
        )
      : of({ data: { cohorts: [], available: 0, claimed: 0, pending: 0 } }),
  ),
  map((res) => res.data),
  map((data) => {
    const cohorts =
      data.cohorts?.map((c) => ({
        cohort: c.cohort,
        spfReward: new Currency(c.spfReward.toString(), spfAsset),
      })) || [];

    return {
      cohorts,
      pending: new Currency(data.pending.toString(), spfAsset),
      available: new Currency(data.available.toString(), spfAsset),
      claimed: new Currency(data.claimed.toString(), spfAsset),
      total: cohorts.reduce(
        (sum, item) => sum.plus(item.spfReward),
        new Currency(0n, spfAsset),
      ),
    };
  }),
  publishReplay(1),
  refCount(),
);
