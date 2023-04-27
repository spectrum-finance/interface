import NautilusLogo from '../../../../../assets/icons/nautilus-logo-icon.svg';
import { ErgoWalletContract } from '../common/ErgoWalletContract';
import { connectWallet } from './connectWallet';
import {
  getAddresses,
  getChangeAddress,
  getUnusedAddresses,
  getUsedAddresses,
} from './getAddresses';
import { getUtxos } from './getUtxos';
import { sign } from './sign';
import { signInput } from './signInput';
import { submitTx } from './submitTx';
import { walletSupportedFeatures } from './walletSupportedFeatures';

export const Nautilus: ErgoWalletContract = {
  name: 'Nautilus Wallet',
  icon: <img width={32} height={32} src={NautilusLogo} />,
  previewIcon: <img src={NautilusLogo} width={21} height={21} />,
  definition: 'recommended',
  extensionLink:
    'https://chrome.google.com/webstore/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjjcchai',
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
