import {
  AdaAssetName,
  AdaPolicyId,
  AssetClass,
} from '@spectrumlabs/cardano-dex-sdk';
import { mkSubject } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/assetClass';
import { Subject } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/types';
import { map, Observable, of, tap } from 'rxjs';

import { applicationConfig } from '../../../../../applicationConfig';
import { AssetInfo } from '../../../../../common/models/AssetInfo';
import { networkAsset } from '../../networkAsset/networkAsset';
import { defaultTokenList$, DefaultTokenListItem } from '../defaultTokenList';
import { assets, CardanoAssetInfo } from './mocks';

const mapSubjectToAssetInfo = new Map<string, AssetInfo>();

const cardanoAssetInfoToAssetInfo = (
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

const defaultTokenListItemToAssetInfo = (
  ac: AssetClass,
  dtli?: DefaultTokenListItem,
): AssetInfo<AssetClass> => {
  return {
    id: dtli?.subject || mkSubject(ac),
    name: dtli?.name || ac.name,
    ticker: dtli?.ticker || ac.name,
    decimals: dtli?.decimals || 0,
    icon: dtli?.subject
      ? `${applicationConfig.networksSettings.cardano_mainnet.metadataUrl}/${dtli?.subject}.png`
      : '',
    data: ac,
  };
};

export const getCardanoAssetInfo = (
  subject: Subject,
): Observable<DefaultTokenListItem | undefined> => {
  return defaultTokenList$.pipe(map((tl) => tl.tokensMap.get(subject)));
};

export const mapAssetClassToAssetInfo = (
  ac: AssetClass,
): Observable<AssetInfo> => {
  if (ac.policyId === AdaPolicyId && ac.name === AdaAssetName) {
    return of(networkAsset);
  }

  const assetSubject: Subject = mkSubject(ac);

  if (mapSubjectToAssetInfo.has(assetSubject)) {
    return of(mapSubjectToAssetInfo.get(assetSubject)!);
  }

  return getCardanoAssetInfo(assetSubject).pipe(
    map((cai) => {
      if (cai) {
        return defaultTokenListItemToAssetInfo(ac, cai);
      } else if (assets[assetSubject]) {
        return cardanoAssetInfoToAssetInfo(ac, assets[assetSubject]);
      } else {
        return defaultTokenListItemToAssetInfo(ac, cai);
      }
    }),
    tap((ai) => mapSubjectToAssetInfo.set(assetSubject, ai)),
  );
};
