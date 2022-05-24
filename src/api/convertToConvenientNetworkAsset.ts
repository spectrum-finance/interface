import { Observable, publishReplay, refCount, switchMap } from 'rxjs';

import { Currency } from '../common/models/Currency';
import { selectedNetwork$ } from '../gateway/common/network';

export const convertToConvenientNetworkAsset = (
  from: Currency | Currency[],
): Observable<Currency> =>
  selectedNetwork$.pipe(
    switchMap((n) => n.convertToConvenientNetworkAsset(from)),
    publishReplay(1),
    refCount(),
  );
