import { AdditionalData } from '../common/AdditionalData';
import { createWallet } from '../common/Wallet';
import VesprLogo from './vespr-icon.svg';

export const Vespr = createWallet<AdditionalData>({
  id: 'Vespr',
  getConnector: () => cardano.nami,
  name: 'Vespr',
  extensionLink:
    'https://chrome.google.com/webstore/detail/nami/lpfcbjknijpeeillifnkikgncikgfhdo?hl=en',
  icon: (
    <img
      style={{ borderRadius: '50%', background: '#0e0e0e' }}
      alt="Nami Logo"
      src={VesprLogo}
      width={32}
      height={32}
    />
  ),
  previewIcon: (
    <img
      style={{ borderRadius: '50%', background: '#0e0e0e' }}
      alt="Nami Logo"
      src={VesprLogo}
      width={21}
      height={21}
    />
  ),
  walletSupportedFeatures: { createPool: false },
  definition: 'default',
  hidden: true,
});
