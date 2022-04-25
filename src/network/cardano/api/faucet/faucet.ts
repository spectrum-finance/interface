import axios from 'axios';
import { filter, from, of, switchMap } from 'rxjs';

import { getAddresses } from '../addresses/addresses';

export const getTestnetTokens = () =>
  getAddresses()
    .pipe(filter(Boolean))
    .pipe(
      switchMap((addresses) =>
        addresses
          ? from(
              axios.post('url', {
                address: addresses[0],
              }),
            )
          : of(undefined),
      ),
    );
