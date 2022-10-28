import axios from 'axios';
import { exhaustMap, filter, first, interval, map, Observable } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';

export const getErgopayAddresses = (requestId: string): Observable<string[]> =>
  interval(1000).pipe(
    exhaustMap(() =>
      axios.get<{ addresses: string[]; success: boolean }>(
        `${applicationConfig.networksSettings.ergo.ergopayUrl}/addresses/${requestId}`,
      ),
    ),
    map((res) => res.data),
    filter((data) => data.success),
    first(),
    map((data) => data.addresses),
  );
