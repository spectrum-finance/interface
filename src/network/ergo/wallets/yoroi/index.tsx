import React from 'react';

import { ReactComponent as YoroiLogo } from '../../../../assets/icons/yoroi-logo-icon.svg';
import { Wallet } from '../../../common';
import { connectWallet } from './connectWallet';
import { getAddresses } from './getAddresses';
import { getNotification } from './getNotification';
import { getUtxos } from './getUtxos';
import { onDisconnect } from './onDisconnect';

export const Yoroi: Wallet = {
  name: 'Yoroi',
  icon: <YoroiLogo />,
  experimental: false,
  extensionLink:
    'https://chrome.google.com/webstore/detail/yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb',
  connectWallet,
  getUtxos,
  getNotification,
  onDisconnect,
  getAddresses,
};
