import { ergoBoxFromProxy } from '@ergolabs/ergo-sdk';
import React from 'react';
import { from, map, of } from 'rxjs';

import { explorer } from '../../../../../services/explorer';
import { ErgoWalletContract } from '../common/ErgoWalletContract';
import { ReactComponent as ReadonlyLogo } from './readonly-logo-icon.svg';

export const ReadonlyWallet: ErgoWalletContract = {
  name: 'Read-only Wallet',
  icon: <ReadonlyLogo />,
  previewIcon: <ReadonlyLogo width={21} height={21} />,
  connectWallet: () => of(true),
  getUtxos: () =>
    from(
      explorer.searchUnspentBoxesByAddresses([
        '9hp1xXVF8VXkYEHdgvTJK7XSEW1vckcKqWx8JTHsAwwGzHH9hxq',
      ]),
    ).pipe(
      map((bs: any) => bs?.map((b: any) => ergoBoxFromProxy(b))),
      map((data) => data ?? []),
    ),
  getUsedAddresses: () =>
    of(['9hp1xXVF8VXkYEHdgvTJK7XSEW1vckcKqWx8JTHsAwwGzHH9hxq']),
  getUnusedAddresses: () => of([]),
  getChangeAddress: () =>
    of('9hp1xXVF8VXkYEHdgvTJK7XSEW1vckcKqWx8JTHsAwwGzHH9hxq'),
  getAddresses: () =>
    of(['9hp1xXVF8VXkYEHdgvTJK7XSEW1vckcKqWx8JTHsAwwGzHH9hxq']),
  sign: () => ({} as any),
  signInput: () => ({} as any),
  submitTx: () => ({} as any),
  extensionLink: '',
  walletSupportedFeatures: { createPool: false },
  definition: 'default',
};
