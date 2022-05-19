import { AssetClass } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/assetClass';
import axios from 'axios';
import {
  combineLatest,
  defer,
  filter,
  first,
  from,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { AssetInfo } from '../../../../common/models/AssetInfo';
import { Currency } from '../../../../common/models/Currency';
import { getAddresses } from '../addresses/addresses';
import { mapAssetClassToAssetInfo } from '../common/cardanoAssetInfo/getCardanoAssetInfo';

interface AvailableAssetItem {
  readonly dripAmount: number;
  readonly dripAsset: {
    unAssetClass: [
      { readonly unCurrencySymbol: string },
      { readonly unTokenName: string },
    ];
  };
}

const mapAssetItemToCurrency = (
  aai: AvailableAssetItem,
): Observable<Currency> =>
  mapAssetClassToAssetInfo({
    name: aai.dripAsset.unAssetClass[1].unTokenName,
    policyId: aai.dripAsset.unAssetClass[0].unCurrencySymbol,
  }).pipe(map((ai) => new Currency(BigInt(aai.dripAmount), ai)));

export const availableAssets$: Observable<Currency[]> = defer(() =>
  from(
    axios.get<AvailableAssetItem[]>(
      `${applicationConfig.networksSettings.cardano.faucet}assets`,
    ),
  ),
).pipe(
  map((res) => res.data),
  switchMap((items) => combineLatest(items.map(mapAssetItemToCurrency))),
  publishReplay(1),
  refCount(),
);

export const requestTestnetAsset = (
  assetInfo: AssetInfo<AssetClass>,
  recaptchaToken: string,
): Observable<any> =>
  getAddresses().pipe(
    filter(Boolean),
    first(),
    switchMap((addresses) => {
      return addresses
        ? from(
            axios.post(
              `${applicationConfig.networksSettings.cardano.faucet}askdrip`,
              {
                requestAddress: addresses[0],
                requestAsset: `${assetInfo.data?.policyId}.${assetInfo.data?.name}`,
                reCaptchaToken: recaptchaToken,
              },
            ),
          )
        : of(undefined);
    }),
  );
