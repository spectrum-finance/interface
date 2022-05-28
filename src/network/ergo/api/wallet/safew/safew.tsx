import React from 'react';

import { ErgoWalletContract } from '../common/ErgoWalletContract';
import { connectWallet } from './connectWallet';
import {
  getAddresses,
  getChangeAddress,
  getUnusedAddresses,
  getUsedAddresses,
} from './getAddresses';
import { getUtxos } from './getUtxos';
import { ReactComponent as SafewLogo } from './logo.svg';
import { sign } from './sign';
import { signInput } from './signInput';
import { submitTx } from './submitTx';
import { walletSupportedFeatures } from './walletSupportedFeatures';

export const Safew: ErgoWalletContract = {
  name: 'SAFEW',
  icon: <SafewLogo />,
  previewIcon: <SafewLogo width={21} height={21} />,
  definition: 'default',
  extensionLink:
    'https://chrome.google.com/webstore/detail/simple-and-fast-ergo-wall/fmpbldieijjehhalgjblbpgjmijencll/',
  connectWallet,
  getUtxos,
  getUsedAddresses,
  getUnusedAddresses,
  getChangeAddress,
  getAddresses,
  sign,
  signInput,
  submitTx,
  walletSupportedFeatures,
};
