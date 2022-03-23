import React from 'react';

import { ReactComponent as YoroiLogo } from '../../../../assets/icons/yoroi-logo-icon.svg';
import { Wallet } from '../../../common';
import { getUnusedAddresses, getUsedAddresses } from '../nautilus/getAddresses';
import { connectWallet } from './connectWallet';
import { getAddresses } from './getAddresses';
import { getNotification } from './getNotification';
import { getUtxos } from './getUtxos';
import { onDisconnect } from './onDisconnect';
import { supportedFeatures } from './supportedFeatures';

export const Yoroi: Wallet = {
  name: 'Yoroi Wallet',
  icon: <YoroiLogo />,
  definition: 'experimental',
  extensionLink:
    'https://chrome.google.com/webstore/detail/yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb',
  connectWallet,
  getUtxos,
  getNotification,
  onDisconnect,
  getUsedAddresses,
  getUnusedAddresses,
  getAddresses,
  supportedFeatures,
};
