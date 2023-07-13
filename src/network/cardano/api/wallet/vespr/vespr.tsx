import { AdditionalData } from '../common/AdditionalData';
import { createWallet } from '../common/Wallet';
import NamiLogo from './nami-icon.svg';

export const Vespr = createWallet<AdditionalData>({
  id: 'Vespr',
  getConnector: () => cardano.nami,
  name: 'Vespr',
  extensionLink:
    'https://chrome.google.com/webstore/detail/nami/lpfcbjknijpeeillifnkikgncikgfhdo?hl=en',
  icon: <img alt="Nami Logo" src={NamiLogo} width={32} height={32} />,
  previewIcon: <img alt="Nami Logo" src={NamiLogo} width={21} height={21} />,
  walletSupportedFeatures: { createPool: false },
  definition: 'default',
  hidden: true,
});
