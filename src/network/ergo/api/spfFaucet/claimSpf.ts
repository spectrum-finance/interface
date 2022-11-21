import axios from 'axios';
import { first, from, Observable, switchMap, tap } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { getAddresses } from '../addresses/addresses';
import { updateStatus } from './spfStatus';

export const claimSpf = (): Observable<any> =>
  getAddresses().pipe(
    first(),
    switchMap((addresses) =>
      from(
        axios.post<void>(
          `${applicationConfig.networksSettings.ergo.spfFaucet}register`,
          { addresses },
        ),
      ),
    ),
    tap(() => updateStatus.next()),
  );
