import axios from 'axios';
import { catchError, from, map, Observable, of } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';

export const getErgopayRequestId = (): Observable<string> =>
  from(
    axios.post<{ requestId: string }>(
      `${applicationConfig.networksSettings.ergo.ergopayUrl}/addresses/requestId`,
    ),
  ).pipe(
    map(({ data }) => data.requestId),
    catchError(() => of('')),
  );
