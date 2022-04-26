import {
  decodeAddr,
  decodeWasmUtxo,
  decodeWasmValue,
  HexString,
  RawTxWitnessSet,
  toWasmValue,
  Value,
} from '@ergolabs/cardano-dex-sdk';
import {
  RawTx,
  RawUnsignedTx,
} from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/tx';
import { TxOut } from '@ergolabs/cardano-dex-sdk/build/main/cardano/entities/txOut';
import { encodeHex } from '@ergolabs/cardano-dex-sdk/build/main/utils/hex';
import { RustModule } from '@ergolabs/cardano-dex-sdk/build/main/utils/rustLoader';
import React, { ReactNode } from 'react';
import {
  catchError,
  combineLatest,
  defer,
  from,
  map,
  mapTo,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
  tap,
  throwError,
  zip,
} from 'rxjs';

import { AssetInfo } from '../../../../../common/models/AssetInfo';
import { Address } from '../../../../../common/types';
import {
  WalletDefinition,
  WalletSupportedFeatures,
} from '../../../../common/Wallet';
import { mapAssetClassToAssetInfo } from '../../common/cardanoAssetInfo/getCardanoAssetInfo';
import { cardanoWasm$ } from '../../common/cardanoWasm';
import { CardanoWalletContract } from './CardanoWalletContract';

export interface CardanoWalletConfig {
  readonly name: string;
  readonly icon: ReactNode;
  readonly previewIcon: ReactNode;
  readonly extensionLink: string;
  readonly definition?: WalletDefinition;
  readonly variableName: string;
  readonly walletSupportedFeatures: WalletSupportedFeatures;
}

const toBalance = (wasmValue: Value): Observable<[bigint, AssetInfo][]> => {
  if (!wasmValue?.length) {
    return of([]);
  }

  return combineLatest(
    wasmValue.map((item) =>
      mapAssetClassToAssetInfo(item).pipe(
        map<AssetInfo, [bigint, AssetInfo]>((ai) => [item.quantity, ai]),
      ),
    ),
  );
};

export const makeCardanoWallet = ({
  name,
  icon,
  extensionLink,
  definition,
  walletSupportedFeatures,
  variableName,
  previewIcon,
}: CardanoWalletConfig): CardanoWalletContract => {
  const ctx$ = defer(() => from(cardano[variableName].enable())).pipe(
    publishReplay(1),
    refCount(),
  );

  const connectWallet = (): Observable<boolean | React.ReactNode> => {
    if (!cardano || !cardano[variableName]) {
      return throwError(() => new Error('EXTENSION_NOT_FOUND'));
    }
    return ctx$.pipe(
      mapTo(true),
      catchError(() => of(false)),
    );
  };

  const getUsedAddresses = (): Observable<Address[]> => {
    return zip([
      ctx$.pipe(switchMap((ctx) => from(ctx.getUsedAddresses()))),
      cardanoWasm$,
    ]).pipe(
      map(([addresses, wasm]) => addresses.map((a) => decodeAddr(a, wasm))),
    );
  };

  const getUnusedAddresses = (): Observable<Address[]> => {
    return zip([
      ctx$.pipe(switchMap((ctx) => from(ctx.getUnusedAddresses()))),
      cardanoWasm$,
    ]).pipe(
      map(([addresses, wasm]) => addresses.map((a) => decodeAddr(a, wasm))),
    );
  };

  const getAddresses = (): Observable<Address[]> => {
    return zip(getUsedAddresses(), getUnusedAddresses()).pipe(
      map(([usedAddrs, unusedAddrs]) => unusedAddrs.concat(usedAddrs)),
    );
  };

  const getBalance = (): Observable<[bigint, AssetInfo][]> => {
    return zip([
      ctx$.pipe(switchMap((ctx) => from(ctx.getBalance()))),
      cardanoWasm$,
    ]).pipe(
      map(([hex, wasm]) => decodeWasmValue(hex, wasm)),
      switchMap((value) => toBalance(value)),
    );
  };

  const getUtxos = (amount?: Value): Observable<TxOut[]> => {
    return ctx$.pipe(
      switchMap((ctx) =>
        from(
          ctx.getUtxos(
            amount
              ? encodeHex(
                  toWasmValue(amount, RustModule.CardanoWasm).to_bytes(),
                )
              : amount,
          ),
        ),
      ),
      map(
        (hexes) =>
          hexes?.map((hex) => decodeWasmUtxo(hex, RustModule.CardanoWasm)) ||
          [],
      ),
    );
  };

  const sign = (tx: RawUnsignedTx): Promise<RawTxWitnessSet> =>
    ctx$.pipe(switchMap((ctx) => from(ctx.signTx(tx)))).toPromise();

  const submit = (tx: RawTx): Observable<HexString> =>
    ctx$.pipe(switchMap((ctx) => from(ctx.submitTx(tx))));

  return {
    name,
    icon,
    extensionLink,
    previewIcon,
    definition: definition || 'default',
    walletSupportedFeatures,
    connectWallet,
    getUsedAddresses,
    getUnusedAddresses,
    getAddresses,
    getBalance,
    getUtxos,
    sign,
    submit,
  };
};
