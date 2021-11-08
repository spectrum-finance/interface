import { ergoBoxFromProxy } from '@ergolabs/ergo-sdk';
import {
  combineLatest,
  filter,
  from,
  interval,
  map,
  of,
  publishReplay,
  refCount,
  startWith,
  switchMap,
} from 'rxjs';

import { ERG_DECIMALS, ERG_TOKEN_NAME } from '../../constants/erg';
import { walletCookies } from '../../utils/cookies';
import { renderFractions } from '../../utils/math';

const TEN_SECONDS = 10 * 1000;

export const isWalletConnected$ = of(
  walletCookies.isSetConnected() && window.ergo_request_read_access,
).pipe(
  filter(Boolean),
  switchMap(() => from(window.ergo_request_read_access())),
  startWith(false),
  publishReplay(1),
  refCount(),
);

export const appTick$ = isWalletConnected$.pipe(
  filter(Boolean),
  switchMap(() => interval(TEN_SECONDS).pipe(startWith(0))),
);

export const utxos$ = appTick$.pipe(
  switchMap(() => from(ergo.get_utxos())),
  map((bs) => bs?.map((b) => ergoBoxFromProxy(b))),
  map((data) => data ?? []),
  publishReplay(1),
  refCount(),
);

export const nativeTokenBalance$ = appTick$.pipe(
  switchMap(() => from(ergo.get_balance(ERG_TOKEN_NAME))),
  map((balance) => renderFractions(balance, ERG_DECIMALS)),
  publishReplay(1),
  refCount(),
);

export const isWalletLoading$ = combineLatest([
  utxos$,
  nativeTokenBalance$,
]).pipe(
  map(() => false),
  startWith(true),
  publishReplay(1),
  refCount(),
);
