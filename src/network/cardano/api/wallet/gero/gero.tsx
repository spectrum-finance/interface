import React from 'react';

import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';
import { ReactComponent as GeroWalletLogo } from './gerowallet-icon.svg';

export const Gero: CardanoWalletContract = makeCardanoWallet({
  variableName: 'gerowallet',
  extensionLink:
    'https://chrome.google.com/webstore/detail/gerowallet/bgpipimickeadkjlklgciifhnalhdjhe/overview',
  walletSupportedFeatures: { createPool: true },
  name: 'GeroWallet',
  icon: <GeroWalletLogo />,
});
