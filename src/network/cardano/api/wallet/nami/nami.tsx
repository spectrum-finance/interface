import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';
import NamiLogo from './nami-icon.svg';

export const Nami: CardanoWalletContract = makeCardanoWallet({
  name: 'Nami',
  variableName: 'nami',
  extensionLink:
    'https://chrome.google.com/webstore/detail/nami/lpfcbjknijpeeillifnkikgncikgfhdo?hl=en',
  icon: <img alt="Nami Logo" src={NamiLogo} width={32} height={32} />,
  previewIcon: <img alt="Nami Logo" src={NamiLogo} width={21} height={21} />,
  walletSupportedFeatures: { createPool: false },
});
