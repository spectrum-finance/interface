import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import { map, Observable, of, publishReplay, refCount } from 'rxjs';

import { ERG_DECIMALS } from '../../common/constants/erg';
import { defaultExFee } from '../../common/constants/settings';
import { useObservable } from '../../common/hooks/useObservable';
import { Currency } from '../../common/models/Currency';
import { normalizeAmount } from '../../common/utils/amount';
import { useSettings } from '../../context';
import { calculateTotalFee } from '../../utils/transactions';

export const UPDATE_TIME = 5 * 1000;
const ERGO_ID =
  '0000000000000000000000000000000000000000000000000000000000000000';

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
