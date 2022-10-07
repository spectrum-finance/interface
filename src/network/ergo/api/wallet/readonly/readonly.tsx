import { ergoBoxFromProxy } from '@ergolabs/ergo-sdk';
import React from 'react';
import { from, map, of } from 'rxjs';

import { localStorageManager } from '../../../../../common/utils/localStorageManager';
import { explorer } from '../../../../../services/explorer';
import { ErgoWalletContract } from '../common/ErgoWalletContract';
import { ReactComponent as ReadonlyLogo } from './readonly-logo-icon.svg';

export const lsKey = 'readonly-ergopay-wallet';

export const ReadonlyWallet: ErgoWalletContract = {
  name: 'Read-only Wallet',
  icon: <ReadonlyLogo />,
  previewIcon: <ReadonlyLogo width={21} height={21} />,
  connectWallet: () => of(true),
  getUtxos: () =>
    from(
      explorer.searchUnspentBoxesByAddresses([
        localStorageManager.get<string>(lsKey)!,
      ]),
    ).pipe(
      map((bs: any) => bs?.map((b: any) => ergoBoxFromProxy(b))),
      map((data) => data ?? []),
    ),
  getUsedAddresses: () => of([localStorageManager.get<string>(lsKey)!]),
  getUnusedAddresses: () => of([]),
  getChangeAddress: () => of(localStorageManager.get<string>(lsKey)!),
  getAddresses: () => of([localStorageManager.get<string>(lsKey)!]),
  sign: () => ({} as any),
  signInput: () => ({} as any),
  submitTx: () => ({} as any),
  extensionLink: '',
  walletSupportedFeatures: { createPool: false },
  definition: 'default',
};
