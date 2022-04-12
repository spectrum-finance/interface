import { decodeAddr, decodeWasmValue, Value } from '@ergolabs/cardano-dex-sdk';
import { RustModule } from '@ergolabs/cardano-dex-sdk/build/main/utils/rustLoader';
import React, { ReactNode } from 'react';
import {
  catchError,
  from,
  map,
  mapTo,
  Observable,
  of,
  switchMap,
  throwError,
  zip,
} from 'rxjs';

import { Balance } from '../../../../../common/models/Balance';
import { Address } from '../../../../../common/types';
import {
  WalletDefinition,
  WalletSupportedFeatures,
} from '../../../../common/Wallet';
import { CardanoWalletContract } from './CardanoWalletContract';

export interface CardanoWalletConfig {
  readonly name: string;
  readonly icon: ReactNode;
  readonly extensionLink: string;
  readonly definition?: WalletDefinition;
  readonly variableName: string;
  readonly walletSupportedFeatures: WalletSupportedFeatures;
}

export const makeCardanoWallet = ({
  name,
  icon,
  extensionLink,
  definition,
  walletSupportedFeatures,
  variableName,
}: CardanoWalletConfig): CardanoWalletContract => ({
  name,
  icon,
  extensionLink,
  definition: definition || 'default',
  walletSupportedFeatures,
  getCtx(): Observable<any> {
    return from(cardano[variableName].enable());
  },
  connectWallet(): Observable<boolean | React.ReactNode> {
    if (!cardano || !cardano[variableName]) {
      return throwError(() => new Error('EXTENSION_NOT_FOUND'));
    }
    return this.getCtx().pipe(
      mapTo(true),
      catchError(() => of(false)),
    ) as any;
  },
  getUsedAddresses(): Observable<Address[]> {
    return this.getCtx().pipe(
      switchMap((ctx) => from(ctx.getUsedAddresses() as Promise<Address[]>)),
      map((addresses) =>
        addresses.map((a) => decodeAddr(a, RustModule._wasm!)),
      ),
    );
  },
  getUnusedAddresses(): Observable<Address[]> {
    return this.getCtx().pipe(
      switchMap((ctx) => from(ctx.getUnusedAddresses() as Promise<Address[]>)),
      map((addresses) =>
        addresses.map((a) => decodeAddr(a, RustModule._wasm!)),
      ),
    );
  },
  getAddresses(): Observable<Address[]> {
    return zip(this.getUsedAddresses(), this.getUnusedAddresses()).pipe(
      map(([usedAddrs, unusedAddrs]) => unusedAddrs.concat(usedAddrs)),
    );
  },
  getBalance(): Observable<Balance> {
    return this.getCtx().pipe(
      switchMap((ctx) => from(ctx.getBalance() as Promise<string>)),
      map((hex) => decodeWasmValue(hex, RustModule._wasm!)),
      map(
        (values) =>
          new Balance(
            values.map((i) => [
              i.quantity,
              {
                name: i.name,
                id: `${i.policyId}-${i.name}`,
                decimals: 0,
              },
            ]),
          ),
      ),
    );
  },
});
