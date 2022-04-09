import { Observable, publishReplay, refCount, switchMap } from 'rxjs';

import { Currency } from '../common/models/Currency';
import { selectedNetwork$ } from '../network/network';

export const convertToUsd = (from: Currency): Observable<Currency> =>
  selectedNetwork$.pipe(
    switchMap((n) => n.convertToUsd(from)),
    publishReplay(1),
    refCount(),
  );
