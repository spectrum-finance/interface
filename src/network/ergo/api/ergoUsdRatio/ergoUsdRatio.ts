import axios from 'axios';
import {
  distinctUntilChanged,
  from,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { usdAsset } from '../../../../common/constants/usdAsset';
import { Ratio } from '../../../../common/models/Ratio';
import { AssetGraph } from '../../../../common/services/AssetGraph';
import { makeCurrencyConverter } from '../../../../common/services/CurrencyConverter';
import { appTick$ } from '../../../../common/streams/appTick';
import { ammPools$ } from '../ammPools/ammPools';
import { networkAsset } from '../networkAsset/networkAsset';

export interface OracleData {
  readonly latest_price: number;
}

export const ergoUsdRatio$: Observable<any> = appTick$.pipe(
  switchMap(() =>
    from(
      axios.get<OracleData>('https://oracle-core.ergopool.io/frontendData', {
        transformResponse: (data) => JSON.parse(JSON.parse(data)),
      }),
    ),
  ),
  map((res) => res.data.latest_price),
  map((latestPrice) =>
    new Ratio(latestPrice.toString(), usdAsset, networkAsset).invertRatio(),
  ),
  distinctUntilChanged(),
  publishReplay(1),
  refCount(),
);

const assetGraph$ = ammPools$.pipe(
  map(AssetGraph.fromPools),
  publishReplay(1),
  refCount(),
);

export const convertToConvenientNetworkAsset = makeCurrencyConverter(
  assetGraph$,
  ergoUsdRatio$,
  usdAsset,
);
