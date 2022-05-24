import { map, Observable, of, publishReplay, refCount } from 'rxjs';

import { Ratio } from '../../../../common/models/Ratio';
import { AssetGraph } from '../../../../common/services/AssetGraph';
import { makeCurrencyConverter } from '../../../../common/services/CurrencyConverter';
import { ammPools$ } from '../ammPools/ammPools';
import { networkAsset } from '../networkAsset/networkAsset';

export interface OracleData {
  readonly latest_price: number;
}

export const adaRatio$: Observable<Ratio> = of(
  new Ratio('1', networkAsset, networkAsset),
);

const assetGraph$ = ammPools$.pipe(
  map(AssetGraph.fromPools),
  publishReplay(1),
  refCount(),
);

export const convertToConvenientNetworkAsset = makeCurrencyConverter(
  assetGraph$,
  adaRatio$,
  networkAsset,
);
