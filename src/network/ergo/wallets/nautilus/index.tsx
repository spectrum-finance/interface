import React from 'react';

import { ReactComponent as NautilusLogo } from '../../../../assets/icons/nautilus-logo-icon.svg';
import { Wallet } from '../../../common';
import { connectWallet } from './connectWallet';
import {
  getAddresses,
  getUnusedAddresses,
  getUsedAddresses,
} from './getAddresses';
import { getUtxos } from './getUtxos';
import { supportedFeatures } from './supportedFeatures';

export const Nautilus: Wallet = {
  name: 'Nautilus Wallet',
  icon: <NautilusLogo />,
  definition: 'recommended',
  extensionLink:
    'https://chrome.google.com/webstore/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjjcchai',
  connectWallet,
  getUtxos,
  getUsedAddresses,
  getUnusedAddresses,
  getAddresses,
  supportedFeatures,
};
