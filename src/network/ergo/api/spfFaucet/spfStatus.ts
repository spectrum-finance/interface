import axios from 'axios';
import { DateTime } from 'luxon';
import {
  filter,
  from,
  interval,
  map,
  merge,
  Observable,
  of,
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
  NoAddresses = 'NoAddresses',
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
  filter((addresses) => !!addresses?.length),
  switchMap((addresses) =>
    !!addresses?.length
      ? from(
          axios.post<RawClaimSpfStatusResponse>(
            `${applicationConfig.networksSettings.ergo.spfFaucet}status`,
            { addresses },
          ),
        )
      : of({ data: { status: SpfStatus.NoAddresses, timestamp: 0 } }),
  ),
  map((res) => ({
    status: res.data.status,
    dateTime: DateTime.fromMillis(res.data.timestamp),
  })),
  publishReplay(1),
  refCount(),
);
