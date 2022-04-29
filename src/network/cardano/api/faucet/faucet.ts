import axios from 'axios';
import { filter, first, from, map, of, switchMap } from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { getAddresses } from '../addresses/addresses';

export const getAvailableTestnetTokensList = () =>
  from(
    axios.get(`${applicationConfig.networksSettings.cardano.faucet}assets`),
  ).pipe(map((res) => res.data));

export const getTestnetTokens = (tokenId: string) =>
  getAddresses().pipe(
    filter(Boolean),
    first(),
    switchMap((addresses) => {
      return addresses
        ? from(
            axios.post(
              `${applicationConfig.networksSettings.cardano.faucet}askdrip`,
              {
                requestAddress: addresses[0],
                requestAsset: tokenId,
              },
            ),
          )
        : of(undefined);
    }),
  );
