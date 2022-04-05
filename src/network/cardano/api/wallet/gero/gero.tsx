import React from 'react';
import { from, Observable, throwError } from 'rxjs';

import { ReactComponent as NamiLogo } from '../../../../../assets/icons/nami-logo-icon.svg';
import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';

export const Gero: CardanoWalletContract = makeCardanoWallet({
  variableName: 'gerowallet',
  extensionLink:
    'https://chrome.google.com/webstore/detail/gerowallet/bgpipimickeadkjlklgciifhnalhdjhe/overview',
  walletSupportedFeatures: { createPool: true },
  name: 'GeroWallet',
  icon: <NamiLogo width={26} height={26} />,
});
