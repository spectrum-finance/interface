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

import { ERG_DECIMALS } from '../../constants/erg';
import { useObservable } from '../../hooks/useObservable';
import {
  getListAvailableTokens,
  isAsset,
} from '../../utils/getListAvailableTokens';
import { fractionsToNum, parseUserInputToFractions } from '../../utils/math';
import { assets$ } from './assets';
import { nativeTokenBalance$, utxos$ } from './core';
import { Currency } from './currency';

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

  toArray() {
    return this.mapAssetIdToBalance.entries();
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
