import React from 'react';

import { ReactComponent as NautilusLogo } from '../../../../assets/icons/nautilus-logo-icon.svg';
import { Wallet } from '../../../common';
import { connectWallet } from './connectWallet';
import { getAddresses } from './getAddresses';
import { getUtxos } from './getUtxos';

export const Nautilus: Wallet = {
  name: 'Nautilus',
  icon: <NautilusLogo />,
  experimental: true,
  extensionLink:
    'https://chrome.google.com/webstore/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjjcchai',
  connectWallet,
  getUtxos,
  getAddresses,
};
