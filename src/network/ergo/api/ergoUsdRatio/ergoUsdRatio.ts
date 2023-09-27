import axios from 'axios';
import {
  catchError,
  distinctUntilChanged,
  from,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { usdAsset } from '../../../../common/constants/usdAsset';
import { Ratio } from '../../../../common/models/Ratio';
import { AssetGraph } from '../../../../common/services/AssetGraph';
import { makeCurrencyConverter } from '../../../../common/services/CurrencyConverter';
import { appTick$ } from '../../../../common/streams/appTick';
import { allAmmPools$ } from "../ammPools/ammPools";
import { networkAsset } from '../networkAsset/networkAsset';

export interface OracleData {
  readonly latest_price: number;
}

export const ergoUsdRatio$: Observable<any> = appTick$.pipe(
  switchMap(() =>
    from(
      Promise.race([
        axios.get<OracleData>('https://oracle-core.ergopool.io/frontendData', {
          transformResponse: (data) => JSON.parse(JSON.parse(data)),
        }),
        axios.get<OracleData>(
          'https://erg-oracle-ergusd.spirepools.com/frontendData',
          {
            transformResponse: (data) => JSON.parse(JSON.parse(data)),
          },
        ),
      ]),
    ),
  ),
  map((res) => res?.data?.latest_price || 0),
  catchError(() => of(0)),
  distinctUntilChanged(),
  map((latestPrice) =>
    new Ratio(latestPrice.toString(), usdAsset, networkAsset).invertRatio(),
  ),
  publishReplay(1),
  refCount(),
);

const assetGraph$ = allAmmPools$.pipe(
  map(AssetGraph.fromPools),
  publishReplay(1),
  refCount(),
);

export const convertToConvenientNetworkAsset = makeCurrencyConverter(
  assetGraph$,
  ergoUsdRatio$,
  usdAsset,
);
