import {
  combineLatest,
  from,
  map,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { Currency } from '../../../common/models/Currency';
import { explorer } from '../../../services/explorer';
import { addresses$ } from '../addresses/addresses';
import { networkAsset } from '../networkAsset/networkAsset';

export const networkAssetBalance$ = addresses$.pipe(
  switchMap((addresses) =>
    combineLatest(
      addresses.map((address) => from(explorer.getBalanceByAddress(address))),
    ),
  ),
  map((balances) =>
    balances.reduce((acc, balance) => acc + (balance?.nErgs || 0n), 0n),
  ),
  map((sum) => new Currency(sum, networkAsset)),
  publishReplay(1),
  refCount(),
);
