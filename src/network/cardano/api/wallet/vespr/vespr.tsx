import { AdditionalData } from '../common/AdditionalData';
import { createWallet } from '../common/Wallet';
import VesprLogo from './vespr-icon.svg';

export const Vespr = createWallet<AdditionalData>({
  id: 'vespr',
  getConnector: () => cardano.vespr,
  name: 'Vespr',
  extensionLink: 'https://vespr.xyz/',
  icon: (
    <img
      style={{ borderRadius: '50%', background: '#0e0e0e' }}
      alt="Vespr Logo"
      src={VesprLogo}
      width={32}
      height={32}
    />
  ),
  previewIcon: (
    <img
      style={{ borderRadius: '50%', background: '#0e0e0e' }}
      alt="Vespr Logo"
      src={VesprLogo}
      width={21}
      height={21}
    />
  ),
  walletSupportedFeatures: { createPool: false },
  definition: 'default',
  hidden: false,
});
