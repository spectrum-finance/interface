import axios from 'axios';
import { DateTime } from 'luxon';
import {
  from,
  interval,
  map,
  merge,
  Observable,
  publishReplay,
  refCount,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { getAddresses } from '../addresses/addresses';

const pollingInterval = interval(60_000).pipe(
  startWith(0),
  publishReplay(1),
  refCount(),
);

export const updateStatus = new Subject<void>();

export enum SpfStatus {
  Init = 'Init',
  Pending = 'Pending',
  WaitingConfirmation = 'WaitingConfirmation',
  Claimed = 'Claimed',
  NothingToClaim = 'NothingToClaim',
}

export interface RawClaimSpfStatusResponse {
  readonly status: SpfStatus;
  readonly timestamp: number;
}

export interface ClaimSpfStatusResponse {
  readonly status: SpfStatus;
  readonly dateTime: DateTime;
}

export const spfStatus$: Observable<ClaimSpfStatusResponse> = merge(
  pollingInterval,
  updateStatus,
).pipe(
  switchMap(() => getAddresses()),
  switchMap((addresses) =>
    from(
      axios.post<RawClaimSpfStatusResponse>(
        `${applicationConfig.networksSettings.ergo.spfFaucet}status`,
        { addresses },
      ),
    ),
  ),
  map((res) => ({
    status: res.data.status,
    dateTime: DateTime.fromMillis(res.data.timestamp),
  })),
  publishReplay(1),
  refCount(),
);
