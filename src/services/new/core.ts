import { ergoBoxFromProxy } from '@ergolabs/ergo-sdk';
import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import {
  combineLatest,
  distinctUntilChanged,
  exhaustMap,
  filter,
  from,
  map,
  mapTo,
  Observable,
  of,
  publishReplay,
  refCount,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';

import { ERG_DECIMALS, ERG_TOKEN_NAME } from '../../common/constants/erg';
import { defaultExFee } from '../../common/constants/settings';
import { useObservable } from '../../common/hooks/useObservable';
import { Currency } from '../../common/models/Currency';
import { normalizeAmount } from '../../common/utils/amount';
import { useSettings } from '../../context';
import { networkContext$ } from '../../network/ergo/networkContext/networkContext';
import { walletCookies } from '../../utils/cookies';
import { renderFractions } from '../../utils/math';
import { calculateTotalFee } from '../../utils/transactions';

export const UPDATE_TIME = 5 * 1000;
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

export const connectWallet = (): void => {
  updateWalletState.next(undefined);
};

export const isWalletSetuped$ = walletState$.pipe(
  filter(
    (state) =>
      state === WalletState.CONNECTED || state === WalletState.CONNECTING,
  ),
  mapTo(true),
  publishReplay(1),
  refCount(),
);

export const isWalletConnected$ = walletState$.pipe(
  filter((state) => state === WalletState.CONNECTED),
  mapTo(true),
  publishReplay(1),
  refCount(),
);

export const appTick$ = walletState$.pipe(
  filter((state) => state === WalletState.CONNECTED),
  switchMap(() => networkContext$),
  publishReplay(1),
  refCount(),
);

export const utxos$ = appTick$.pipe(
  exhaustMap(() => from(ergo.get_utxos())),
  map((bs) => bs?.map((b) => ergoBoxFromProxy(b))),
  map((data) => data ?? []),
  publishReplay(1),
  refCount(),
);

export const nativeTokenBalance$ = appTick$.pipe(
  exhaustMap(() => from(ergo.get_balance(ERG_TOKEN_NAME))),
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

export const networkAsset = {
  name: 'ERG',
  id: ERGO_ID,
  decimals: ERG_DECIMALS,
};

export const networkAsset$: Observable<AssetInfo> = of(networkAsset).pipe(
  publishReplay(1),
  refCount(),
);

export const defaultExFee$: Observable<Currency> = networkAsset$.pipe(
  map((nativeToken) => new Currency(defaultExFee.toString(), nativeToken)),
  publishReplay(1),
  refCount(),
);

export const useNetworkAsset = (): AssetInfo => {
  const [_nativeToken] = useObservable(networkAsset$, [], networkAsset);

  return _nativeToken;
};

export const useMinExFee = (): Currency => {
  const [{ minerFee }] = useSettings();
  const networkAsset = useNetworkAsset();

  const exFee = +normalizeAmount((minerFee * 3).toString(), networkAsset);

  return new Currency(calculateTotalFee([exFee], ERG_DECIMALS), networkAsset);
};

export const useMaxExFee = (): Currency => {
  const [{ minerFee, nitro }] = useSettings();
  const networkAsset = useNetworkAsset();

  const exFee = +normalizeAmount(
    (minerFee * 3 * nitro).toString(),
    networkAsset,
  );

  return new Currency(calculateTotalFee([exFee], ERG_DECIMALS), networkAsset);
};

export const useMaxTotalFees = (): Currency => {
  const [{ minerFee, nitro }] = useSettings();
  const networkAsset = useNetworkAsset();

  const exFee = +normalizeAmount(
    (minerFee * 3 * nitro).toString(),
    networkAsset,
  );

  return new Currency(
    calculateTotalFee([minerFee, exFee], ERG_DECIMALS),
    networkAsset,
  );
};

export const useMinTotalFees = (): Currency => {
  const [{ minerFee }] = useSettings();
  const networkAsset = useNetworkAsset();

  const exFee = +normalizeAmount((minerFee * 3).toString(), networkAsset);

  return new Currency(
    calculateTotalFee([minerFee, exFee], ERG_DECIMALS),
    networkAsset,
  );
};
