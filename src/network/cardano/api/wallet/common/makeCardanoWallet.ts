import React, { ReactNode } from 'react';
import { catchError, from, Observable, of, throwError } from 'rxjs';

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
  connectWallet(): Observable<boolean | React.ReactNode> {
    if (!cardano || !cardano[variableName]) {
      return throwError(() => new Error('EXTENSION_NOT_FOUND'));
    }
    return from(cardano[variableName].enable().then(() => true)).pipe(
      catchError(() => of(false)),
    ) as any;
  },
});
