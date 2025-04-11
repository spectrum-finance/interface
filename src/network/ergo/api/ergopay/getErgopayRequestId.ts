import axios from 'axios';
import { catchError, from, map, Observable, of } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';

export const getErgopayRequestId = (): Observable<string> =>
  from(
    axios.post<{ id: string }>(
      `${applicationConfig.networksSettings.ergo.ergopayUrl}/createAuth`,
    ),
  ).pipe(
    map(({ data }) => data.id),
    catchError(() => of('')),
  );
