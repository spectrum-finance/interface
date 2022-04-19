import React from 'react';

import { ReactComponent as NautilusLogo } from '../../../../../assets/icons/nautilus-logo-icon.svg';
import { ErgoWalletContract } from '../common/ErgoWalletContract';
import { connectWallet } from './connectWallet';
import {
  getAddresses,
  getUnusedAddresses,
  getUsedAddresses,
} from './getAddresses';
import { getUtxos } from './getUtxos';
import { walletSupportedFeatures } from './walletSupportedFeatures';

export const Nautilus: ErgoWalletContract = {
  name: 'Nautilus Wallet',
  icon: <NautilusLogo />,
  previewIcon: <NautilusLogo width={21} height={21} />,
  definition: 'recommended',
  extensionLink:
    'https://chrome.google.com/webstore/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjjcchai',
  connectWallet,
  getUtxos,
  getUsedAddresses,
  getUnusedAddresses,
  getAddresses,
  walletSupportedFeatures,
};
