import React from 'react';

import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';
import { ReactComponent as YoroiLogo } from './yoroi-icon.svg';

export const Yoroi: CardanoWalletContract = makeCardanoWallet({
  definition: 'experimental',
  variableName: 'yoroi',
  extensionLink:
    'https://chrome.google.com/webstore/detail/eternlcc/kmhcihpebfmpgmihbkipmjlmmioameka',
  walletSupportedFeatures: { createPool: true },
  name: 'Yoroi',
  icon: <YoroiLogo />,
});
