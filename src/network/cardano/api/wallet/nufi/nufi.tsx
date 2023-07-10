import { AdditionalData } from '../common/AdditionalData';
import { createWallet } from '../common/Wallet';
import NufiLogo from './nufi-icon.svg';

export const Nufi = createWallet<AdditionalData>({
  id: 'Nufi',
  getConnector: () => cardano.nufi,
  name: 'Nufi',
  extensionLink:
    'https://chrome.google.com/webstore/detail/nufi/gpnihlnnodeiiaakbikldcihojploeca?hl=en',
  icon: <img alt="Nufi Logo" src={NufiLogo} width={32} height={32} />,
  previewIcon: <img alt="Nufi Logo" src={NufiLogo} width={21} height={21} />,
  walletSupportedFeatures: { createPool: false },
  definition: 'default',
});
