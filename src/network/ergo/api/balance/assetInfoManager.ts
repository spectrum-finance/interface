import { AugAssetInfo } from '@ergolabs/ergo-sdk/build/main/network/models';
import { BehaviorSubject, from, Observable, tap } from 'rxjs';

import { explorer } from '../../../../services/explorer';

const mapIdToBs = new Map<string, BehaviorSubject<AugAssetInfo | undefined>>();

export const getFullTokenInfo = (
  assetId: string,
): Observable<AugAssetInfo | undefined> => {
  if (mapIdToBs.has(assetId)) {
    return mapIdToBs.get(assetId)!;
  }
  return from(explorer.getFullTokenInfo(assetId)).pipe(
    tap((assetInfo) => {
      mapIdToBs.set(assetId, new BehaviorSubject(assetInfo));
    }),
  );
};
