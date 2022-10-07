import { ergoBoxFromProxy } from '@ergolabs/ergo-sdk';
import React from 'react';
import { from, map, of } from 'rxjs';

import { localStorageManager } from '../../../../../common/utils/localStorageManager';
import { explorer } from '../../../../../services/explorer';
import { ErgoWalletContract } from '../common/ErgoWalletContract';
import { ReactComponent as ReadonlyLogo } from './readonly-logo-icon.svg';

export const READ_ONLY_ADDRESS_KEY = 'readonly-ergopay-wallet';

export const setReadonlyAddress = (address: string): void =>
  localStorageManager.set<string>(READ_ONLY_ADDRESS_KEY, address);

export const hasReadonlyAddress = (): boolean =>
  !!localStorageManager.get(READ_ONLY_ADDRESS_KEY);

export const ReadonlyWallet: ErgoWalletContract = {
  name: 'Read-only Wallet',
  hidden: true,
  icon: <ReadonlyLogo />,
  previewIcon: <ReadonlyLogo width={21} height={21} />,
  connectWallet: () => of(true),
  getUtxos: () =>
    from(
      explorer.searchUnspentBoxesByAddresses([
        localStorageManager.get<string>(READ_ONLY_ADDRESS_KEY)!,
      ]),
    ).pipe(
      map((bs: any) => bs?.map((b: any) => ergoBoxFromProxy(b))),
      map((data) => data ?? []),
    ),
  getUsedAddresses: () =>
    of([localStorageManager.get<string>(READ_ONLY_ADDRESS_KEY)!]),
  getUnusedAddresses: () => of([]),
  getChangeAddress: () =>
    of(localStorageManager.get<string>(READ_ONLY_ADDRESS_KEY)!),
  getAddresses: () =>
    of([localStorageManager.get<string>(READ_ONLY_ADDRESS_KEY)!]),
  sign: () => ({} as any),
  signInput: () => ({} as any),
  submitTx: () => ({} as any),
  extensionLink: '',
  walletSupportedFeatures: { createPool: false },
  definition: 'default',
};
