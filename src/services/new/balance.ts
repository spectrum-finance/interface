import { AssetInfo } from '@ergolabs/ergo-sdk/build/main/entities/assetInfo';
import {
  combineLatest,
  debounceTime,
  map,
  Observable,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { Currency } from '../../common/models/Currency';
import { ERG_DECIMALS } from '../../constants/erg';
import { useObservable } from '../../hooks/useObservable';
import { getListAvailableTokens } from '../../utils/getListAvailableTokens';
import { parseUserInputToFractions } from '../../utils/math';
import { assets$ } from './assets';
import { nativeTokenBalance$, utxos$ } from './core';

const ERGO_ID =
  '0000000000000000000000000000000000000000000000000000000000000000';

export class Balance {
  private mapAssetIdToBalance = new Map<string, Currency>();

  constructor(assetAmount: [bigint, AssetInfo][]) {
    this.mapAssetIdToBalance = new Map(
      assetAmount.map(([amount, info]) => [
        info.id,
        new Currency(amount, info),
      ]),
    );
  }

  get(asset: AssetInfo): Currency {
    return this.mapAssetIdToBalance.get(asset.id) || new Currency(0n, asset);
  }

  entries() {
    return Array.from(this.mapAssetIdToBalance.entries());
  }

  values() {
    return Array.from(this.mapAssetIdToBalance.values());
  }
}

export const walletBalance$ = combineLatest([
  nativeTokenBalance$.pipe(
    map((balance) => parseUserInputToFractions(balance, ERG_DECIMALS)),
  ),
  utxos$.pipe(switchMap(() => assets$)),
  utxos$.pipe(map((utxos) => Object.values(getListAvailableTokens(utxos)))),
]).pipe(
  debounceTime(200),
  map(([nativeTokenBalance, assets, boxAssets]) =>
    boxAssets
      .map<[bigint, AssetInfo]>((ba) => [
        ba.amount,
        assets.find((a) => a.id === ba.tokenId)!,
      ])
      .concat([[nativeTokenBalance, assets.find((a) => a.id === ERGO_ID)!]])
      .filter((i) => !!i[1]),
  ),
  map((data) => new Balance(data)),
  publishReplay(1),
  refCount(),
);
walletBalance$.subscribe(() => {});

export const useWalletBalance = () =>
  useObservable(walletBalance$, {
    defaultValue: new Balance([]),
  });

export const getBalanceByAsset = (asset: AssetInfo): Observable<Currency> =>
  walletBalance$.pipe(
    map((balance) => balance.get(asset)),
    publishReplay(1),
    refCount(),
  );
