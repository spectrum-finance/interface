import {
  AdaAssetName,
  AdaPolicyId,
  AssetClass,
} from '@ergolabs/cardano-dex-sdk';
import { mkSubject } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/assetClass';
import { map, Observable, of } from 'rxjs';

import { AssetInfo } from '../../../../../common/models/AssetInfo';
import { networkAsset } from '../../networkAsset/networkAsset';
import { assets, CardanoAssetInfo } from './mocks';

const toAssetInfo = (ac: AssetClass, cai?: CardanoAssetInfo): AssetInfo => ({
  id: cai?.subject || mkSubject(ac),
  name: cai?.name.value || ac.name,
  decimals: cai?.decimals.value || 0,
});

export const getCardanoAssetInfo = (
  ac: AssetClass,
): Observable<CardanoAssetInfo | undefined> => of(assets[mkSubject(ac)]);

export const mapAssetClassToAssetInfo = (
  ac: AssetClass,
): Observable<AssetInfo> => {
  if (ac.policyId === AdaPolicyId && ac.name === AdaAssetName) {
    return of(networkAsset);
  }

  return getCardanoAssetInfo(ac).pipe(map((cai) => toAssetInfo(ac, cai)));
};
