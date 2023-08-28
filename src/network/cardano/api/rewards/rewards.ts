import { from, Observable, switchMap } from 'rxjs';

import { Currency } from '../../../../common/models/Currency.ts';
import { RewardsData } from './types/types.ts';

export const userRewards$: Observable<RewardsData> = from([
  {
    lbspRewards: {
      collected: new Currency(934809234n, {
        id: '000123',
        name: 'SPF',
        decimals: 6,
        ticker: 'SPF',
      }),
      upcoming: new Currency(934809234n, {
        id: '000123',
        name: 'SPF',
        decimals: 6,
        ticker: 'SPF',
      }),
    },
    ispoRewards: {
      collected: new Currency(934809234n, {
        id: '000123',
        name: 'SPF',
        decimals: 6,
        ticker: 'SPF',
      }),
      upcoming: new Currency(934809234n, {
        id: '000123',
        name: 'SPF',
        decimals: 6,
        ticker: 'SPF',
      }),
    },
    airdropRewards: undefined,
    // airdropRewards: {
    //   collected: new Currency(0n, {
    //     id: '000123',
    //     name: 'SPF',
    //     decimals: 6,
    //     ticker: 'SPF',
    //   }),
    // },
  },
]).pipe(
  switchMap((rewards) => {
    return [
      {
        ...rewards,
        totalCollected: Object.keys(rewards).reduce(
          (acc, key) => {
            return rewards[key] ? rewards[key].collected.plus(acc) : acc;
          },
          new Currency(0n, {
            id: '000123',
            name: 'SPF',
            decimals: 6,
            ticker: 'SPF',
          }),
        ),
      },
    ];
  }),
);
