import React from 'react';

import { ReactComponent as NamiLogo } from '../../../../../assets/icons/nami-logo-icon.svg';
import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';

export const Nami: CardanoWalletContract = makeCardanoWallet({
  variableName: 'nami',
  extensionLink:
    'https://chrome.google.com/webstore/detail/nami/lpfcbjknijpeeillifnkikgncikgfhdo?hl=en',
  walletSupportedFeatures: { createPool: true },
  name: 'Nami',
  icon: <NamiLogo width={26} height={26} />,
});
