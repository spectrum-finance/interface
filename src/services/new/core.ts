import { ergoBoxFromProxy } from '@ergolabs/ergo-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  from,
  interval,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';

import { ERG_DECIMALS, ERG_TOKEN_NAME, UI_FEE } from '../../constants/erg';
import { defaultExFee } from '../../constants/settings';
import { useSettings } from '../../context';
import { useObservable } from '../../hooks/useObservable';
import { walletCookies } from '../../utils/cookies';
import { renderFractions } from '../../utils/math';
import { calculateTotalFee } from '../../utils/transactions';
import { Currency } from './currency';

const UPDATE_TIME = 5 * 1000;
const ERGO_ID =
  '0000000000000000000000000000000000000000000000000000000000000000';

export enum WalletState {
  NOT_CONNECTED,
  CONNECTING,
  CONNECTED,
}

const updateWalletState = new Subject();

export const walletState$ = updateWalletState.pipe(
  startWith(undefined),
  switchMap(() =>
    walletCookies.isSetConnected() && !!window.ergo_request_read_access
      ? from(window.ergo_request_read_access()).pipe(
          map((value) =>
            value ? WalletState.CONNECTED : WalletState.CONNECTING,
          ),
          startWith(WalletState.CONNECTING),
        )
      : of(WalletState.NOT_CONNECTED),
  ),
  distinctUntilChanged(),
  publishReplay(1),
  refCount(),
);

export const connectWallet = () => {
  updateWalletState.next(undefined);
};

export const isWalletSetuped$ = walletState$.pipe(
  filter(
    (state) =>
      state === WalletState.CONNECTED || state === WalletState.CONNECTING,
  ),
  publishReplay(1),
  refCount(),
);

export const appTick$ = walletState$.pipe(
  filter((state) => state === WalletState.CONNECTED),
  switchMap(() => interval(UPDATE_TIME).pipe(startWith(0))),
  publishReplay(1),
  refCount(),
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

export const getTokenBalance = (tokenId: string): Observable<number> =>
  isWalletSetuped$.pipe(
    filter(Boolean),
    switchMap(() =>
      from(
        tokenId === ERGO_ID
          ? ergo.get_balance(ERG_TOKEN_NAME)
          : ergo.get_balance(tokenId),
      ),
    ),
    map((amount) => +renderFractions(amount, ERG_DECIMALS)),
  );

export const nativeToken = {
  name: 'ERG',
  id: ERGO_ID,
  decimals: ERG_DECIMALS,
};

export const nativeToken$: Observable<AssetInfo> = of(nativeToken).pipe(
  publishReplay(1),
  refCount(),
);

export const uiFee$: Observable<Currency> = nativeToken$.pipe(
  map((nativeToken) => new Currency(UI_FEE.toString(), nativeToken)),
  publishReplay(1),
  refCount(),
);

export const defaultExFee$: Observable<Currency> = nativeToken$.pipe(
  map((nativeToken) => new Currency(defaultExFee.toString(), nativeToken)),
  publishReplay(1),
  refCount(),
);

export const useNativeToken = (): AssetInfo => {
  const [_nativeToken] = useObservable(nativeToken$, {
    defaultValue: nativeToken,
  });

  return _nativeToken;
};

export const useTotalFees = (): Currency => {
  const [{ minerFee }] = useSettings();

  return new Currency(
    calculateTotalFee([minerFee, UI_FEE, defaultExFee], ERG_DECIMALS),
    nativeToken,
  );
};
