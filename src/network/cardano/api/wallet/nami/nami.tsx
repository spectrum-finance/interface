import React from 'react';

import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';
import { ReactComponent as NamiLogo } from './nami-icon.svg';

export const Nami: CardanoWalletContract = makeCardanoWallet({
  variableName: 'nami',
  extensionLink:
    'https://chrome.google.com/webstore/detail/nami/lpfcbjknijpeeillifnkikgncikgfhdo?hl=en',
  walletSupportedFeatures: { createPool: true },
  name: 'Nami',
  icon: <NamiLogo />,
  testnetSwitchGuideUrl:
    'https://docs.ergodex.io/docs/user-guides/change-wallet-to-testnet/#nami-wallet',
  previewIcon: <NamiLogo width={21} height={21} />,
});
