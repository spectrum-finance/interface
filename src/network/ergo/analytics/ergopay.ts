import axios from 'axios';
import {
  distinctUntilKeyChanged,
  exhaustMap,
  first,
  map,
  mapTo,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { applicationConfig } from '../../../applicationConfig';
import { appTick$ } from '../../../common/streams/appTick';
import { settings$ } from '../settings/settings';

interface TxForMark {
  readonly ergopayId: string;
  readonly txInfo: object;
  readonly txId: string;
  readonly status: 'success' | 'error';
}

const ergoPayAnalytics$: Observable<TxForMark[]> = settings$.pipe(
  switchMap((settings) => appTick$.pipe(mapTo(settings))),
  exhaustMap(({ address }) =>
    axios.get<TxForMark[]>(
      `${applicationConfig.networksSettings.ergo.ergopayUrl}/unsignedTx/${address}/waiting_for_mark`,
    ),
  ),
  map((res) => res.data),
  distinctUntilKeyChanged('length'),
  publishReplay(1),
  refCount(),
);

const markTxs = (txs: TxForMark[], address: string): void => {
  settings$
    .pipe(first())
    .subscribe((settings) =>
      axios.post(
        `${applicationConfig.networksSettings.ergo.ergopayUrl}/unsignedTx/${address}/mark`,
        { transactions: txs.map((tx) => tx.ergopayId) },
      ),
    );
};

export const initializeErgoPayAnalytics = () => {
  ergoPayAnalytics$.subscribe((txsForMark) => {});
};
