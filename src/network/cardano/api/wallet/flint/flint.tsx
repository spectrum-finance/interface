import React from 'react';

import { ReactComponent as FlintLogo } from '../../../../../assets/icons/flint-logo-icon.svg';
import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';

export const Flint: CardanoWalletContract = makeCardanoWallet({
  variableName: 'flint',
  extensionLink:
    'https://chrome.google.com/webstore/detail/flint-wallet/hnhobjmcibchnmglfbldbfabcgaknlkj?hl=en',
  walletSupportedFeatures: { createPool: true },
  name: 'FlintWallet',
  icon: <FlintLogo width={26} height={26} />,
});
