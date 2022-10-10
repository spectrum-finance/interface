import {
  AdaAssetName,
  AdaPolicyId,
  AssetClass,
} from '@ergolabs/cardano-dex-sdk';
import { mkSubject } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/assetClass';
import { Subject } from '@ergolabs/cardano-dex-sdk/build/main/cardano/types';
import axios from 'axios';
import { catchError, from, map, Observable, of, tap } from 'rxjs';

import { applicationConfig } from '../../../../../applicationConfig';
import { AssetInfo } from '../../../../../common/models/AssetInfo';
import { networkAsset } from '../../networkAsset/networkAsset';
import { assets, CardanoAssetInfo } from './mocks';

const mapSubjectToAssetInfo = new Map<string, AssetInfo>();

const toAssetInfo = (
  ac: AssetClass,
  cai?: CardanoAssetInfo,
): AssetInfo<AssetClass> => {
  return {
    id: cai?.subject || mkSubject(ac),
    name: cai?.name?.value || ac.name,
    ticker: cai?.ticker?.value || ac.name,
    decimals: cai?.decimals?.value || 0,
    icon: `data:image/png;base64, ${cai?.logo?.value || ''}`,
    data: ac,
  };
};

export const getCardanoAssetInfo = (
  subject: Subject,
): Observable<CardanoAssetInfo | undefined> =>
  from(
    axios.get(
      `${applicationConfig.networksSettings.cardano.metadataUrl}/${subject}`,
    ),
  ).pipe(
    map((res) => res.data),
    catchError(() => of(undefined)),
  );

export const mapAssetClassToAssetInfo = (
  ac: AssetClass,
): Observable<AssetInfo> => {
  const assetSubject: Subject = mkSubject(ac);

  if (mapSubjectToAssetInfo.has(assetSubject)) {
    return of(mapSubjectToAssetInfo.get(assetSubject)!);
  }

  if (ac.policyId === AdaPolicyId && ac.name === AdaAssetName) {
    return of(networkAsset);
  }
  if (assets[assetSubject]) {
    return of(toAssetInfo(ac, assets[assetSubject]));
  }

  return getCardanoAssetInfo(assetSubject).pipe(
    map((cai) => toAssetInfo(ac, cai)),
    tap((ai) => mapSubjectToAssetInfo.set(assetSubject, ai)),
  );
};
