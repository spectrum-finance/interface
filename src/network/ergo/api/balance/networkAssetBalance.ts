import {
  combineLatest,
  from,
  map,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { Currency } from '../../../../common/models/Currency';
import { explorer } from '../../../../services/explorer';
import { getAddresses } from '../addresses/addresses';
import { networkAsset } from '../networkAsset/networkAsset';
import { networkContext$ } from '../networkContext/networkContext';

export const networkAssetBalance$ = networkContext$.pipe(
  switchMap(() => getAddresses()),
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
