import React from 'react';

import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';
import { ReactComponent as FlintLogo } from './flint-icon.svg';

export const Flint: CardanoWalletContract = makeCardanoWallet({
  variableName: 'flint',
  extensionLink:
    'https://chrome.google.com/webstore/detail/flint-wallet/hnhobjmcibchnmglfbldbfabcgaknlkj?hl=en',
  walletSupportedFeatures: { createPool: false },
  name: 'FlintWallet',
  icon: <FlintLogo width={26} height={26} />,
  testnetSwitchGuideUrl:
    'https://docs.spectrum.fi/docs/user-guides/change-wallet-to-testnet/#flint-wallet',
  previewIcon: <FlintLogo width={21} height={21} />,
});
