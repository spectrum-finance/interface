import React from 'react';

import { ReactComponent as YoroiLogo } from '../../../../../assets/icons/yoroi-logo-icon.svg';
import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';

export const Eternl: CardanoWalletContract = makeCardanoWallet({
  variableName: 'eternl',
  extensionLink:
    'https://chrome.google.com/webstore/detail/eternlcc/kmhcihpebfmpgmihbkipmjlmmioameka',
  walletSupportedFeatures: { createPool: true },
  name: 'Eternl',
  icon: <YoroiLogo />,
});
