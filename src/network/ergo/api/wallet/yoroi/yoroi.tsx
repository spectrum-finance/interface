import React from 'react';

import { ReactComponent as YoroiLogo } from '../../../../../assets/icons/yoroi-logo-icon.svg';
import { ErgoWalletContract } from '../common/ErgoWalletContract';
import { getUnusedAddresses, getUsedAddresses } from '../nautilus/getAddresses';
import { connectWallet } from './connectWallet';
import { getAddresses } from './getAddresses';
import { getUtxos } from './getUtxos';
import { onConnect } from './onConnect';
import { onDisconnect } from './onDisconnect';
import { walletSupportedFeatures } from './supportedFeatures';

export const Yoroi: ErgoWalletContract = {
  name: 'Yoroi Wallet',
  icon: <YoroiLogo />,
  previewIcon: <YoroiLogo width={21} height={21} />,
  definition: 'experimental',
  extensionLink:
    'https://chrome.google.com/webstore/detail/yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb',
  connectWallet,
  getUtxos,
  onConnect,
  onDisconnect,
  getUsedAddresses,
  getUnusedAddresses,
  getAddresses,
  walletSupportedFeatures,
};
