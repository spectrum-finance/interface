import React from 'react';

import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';
import { ReactComponent as NufiLogo } from './nufi-icon.svg';

export const Nufi: CardanoWalletContract = makeCardanoWallet({
  variableName: 'nufi',
  extensionLink:
    'https://chrome.google.com/webstore/detail/nufi/gpnihlnnodeiiaakbikldcihojploeca?hl=en',
  walletSupportedFeatures: { createPool: false },
  name: 'Nufi',
  icon: <NufiLogo />,
  testnetSwitchGuideUrl:
    'https://docs.spectrum.fi/docs/user-guides/change-wallet-to-testnet/',
  previewIcon: <NufiLogo width={21} height={21} />,
});
