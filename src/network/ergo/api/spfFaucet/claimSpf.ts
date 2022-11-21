import axios from 'axios';
import { first, from, switchMap } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { getAddresses } from '../addresses/addresses';
import { updateStatus } from './spfStatus';

export const claimSpf = (): void => {
  getAddresses()
    .pipe(
      first(),
      switchMap((addresses) =>
        from(
          axios.post<void>(
            `${applicationConfig.networksSettings.ergo.spfFaucet}register`,
            { addresses },
          ),
        ),
      ),
    )
    .subscribe(() => updateStatus.next());
};
