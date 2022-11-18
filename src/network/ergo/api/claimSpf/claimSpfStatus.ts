import axios from 'axios';
import { DateTime } from 'luxon';
import {
  from,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { getAddresses } from '../addresses/addresses';

export enum ClaimSpfStatus {
  Init = 'Init',
  Pending = 'Pending',
  WaitingConfirmation = 'WaitingConfirmation',
  Claimed = 'Claimed',
  NothingToClaim = 'NothingToClaim',
}

export interface RawClaimSpfStatusResponse {
  readonly status: ClaimSpfStatus;
  readonly timestamp: number;
}

export interface ClaimSpfStatusResponse {
  readonly status: ClaimSpfStatus;
  readonly dateTime: DateTime;
}

export const claimSpfStatus$: Observable<ClaimSpfStatusResponse> =
  getAddresses().pipe(
    switchMap((addresses) =>
      from(
        axios.post<RawClaimSpfStatusResponse>(
          `${applicationConfig.networksSettings.ergo.spfFaucet}status`,
          addresses,
        ),
      ),
    ),
    map((res) => ({
      // status: res.data.status,
      status: ClaimSpfStatus.Claimed,
      dateTime: DateTime.fromMillis(res.data.timestamp),
    })),
    publishReplay(1),
    refCount(),
  );
