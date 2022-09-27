import { AugAssetInfo } from '@ergolabs/ergo-sdk/build/main/network/models';
import {
  BehaviorSubject,
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { AssetInfo } from '../../../../common/models/AssetInfo';
import { explorer } from '../../../../services/explorer';
import { networkAsset } from '../networkAsset/networkAsset';
import { defaultTokenList$ } from './defaultTokenList';

const mapDefaultTokenListItemToAssetInfoById = (
  assetId: string,
): Observable<AssetInfo | undefined> =>
  defaultTokenList$.pipe(
    map((dtl) => dtl.tokensMap.get(assetId)),
    map((item) =>
      item
        ? {
            id: item.address,
            name: item.name,
            decimals: item.decimals,
            ticker: item.ticker,
            icon:
              item.logoURI ||
              `${applicationConfig.networksSettings.ergo.metadataUrl}/light/${item.address}.svg`,
            iconFallback: item.logoURI
              ? `${applicationConfig.networksSettings.ergo.metadataUrl}/light/${item.address}.svg`
              : undefined,
            description: '',
            isNft: false,
          }
        : undefined,
    ),
  );

const mapFullTokenInfoToAssetItemById = (
  assetId: string,
): Observable<AssetInfo | undefined> =>
  from(explorer.getFullTokenInfo(assetId)).pipe(
    catchError(() => of(undefined)),
    map<AugAssetInfo | undefined, AssetInfo | undefined>((item) =>
      item
        ? {
            id: item.id,
            name: undefined,
            decimals: item.decimals,
            ticker: item.name,
            icon: `${applicationConfig.networksSettings.ergo.metadataUrl}/light/${item.id}.svg`,
            iconFallback: undefined,
            description: item.description,
            emissionAmount: item.emissionAmount,
            isNft: item.emissionAmount === 1n,
          }
        : undefined,
    ),
  );

const assetInfoCache = new Map<string, Observable<AssetInfo | undefined>>();

export const mapToAssetInfo = (
  assetId: string,
): Observable<AssetInfo | undefined> => {
  if (assetId === networkAsset.id) {
    return of(networkAsset);
  }

  if (assetInfoCache.has(assetId)) {
    return assetInfoCache.get(assetId)!;
  }

  return mapDefaultTokenListItemToAssetInfoById(assetId).pipe(
    switchMap((assetInfo) =>
      assetInfo ? of(assetInfo) : mapFullTokenInfoToAssetItemById(assetId),
    ),
    tap((assetInfo) => {
      assetInfoCache.set(assetId, new BehaviorSubject(assetInfo));
    }),
  );
};
