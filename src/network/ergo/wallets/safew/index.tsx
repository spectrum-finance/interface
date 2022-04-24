import React from 'react';

import { ReactComponent as SafewLogo } from '../../../../assets/icons/safew-logo-icon.svg';
import { Wallet } from '../../../common';
import {
  getAddresses,
  getUnusedAddresses,
  getUsedAddresses,
} from '../nautilus/getAddresses';
import { getUtxos } from '../nautilus/getUtxos';
import { supportedFeatures } from '../nautilus/supportedFeatures';
import { connectWallet } from './connectWallet';

export const Safew: Wallet = {
  name: 'Safew Wallet',
  icon: <SafewLogo />,
  previewIcon: <SafewLogo width={21} height={21} />,
  definition: 'default',
  extensionLink:
    'https://chrome.google.com/webstore/detail/simple-and-fast-ergo-wall/fmpbldieijjehhalgjblbpgjmijencll',
  connectWallet,
  getUtxos,
  getUsedAddresses,
  getUnusedAddresses,
  getAddresses,
  supportedFeatures,
};
