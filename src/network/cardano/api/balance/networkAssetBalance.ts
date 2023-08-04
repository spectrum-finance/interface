import { map, publishReplay, refCount } from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { networkAsset } from '../networkAsset/networkAsset';
import { balanceItemsWithUndefined$ } from './balance';

export const networkAssetBalance$ = balanceItemsWithUndefined$.pipe(
  map((balance) => {
    if (!balance) {
      return undefined as any;
    }
    const adaBalanceItem = balance.find(([, info]) => info === networkAsset);

    return new Currency(adaBalanceItem?.[0] || 0n, networkAsset);
  }),
  publishReplay(1),
  refCount(),
);
