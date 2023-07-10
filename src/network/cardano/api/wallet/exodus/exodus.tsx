import { AdditionalData } from '../common/AdditionalData';
import { createWallet } from '../common/Wallet';
import ExodusLogo from './exodus-icon.svg';

export const Exodus = createWallet<AdditionalData>({
  id: 'Exodus',
  getConnector: () => cardano.exodus,
  name: 'Exodus',
  extensionLink:
    'https://chrome.google.com/webstore/detail/exodus-web3-wallet/aholpfdialjgjfhomihkjbmgjidlcdno',
  icon: <img alt="Exodus Logo" src={ExodusLogo} height={32} width={32} />,
  previewIcon: (
    <img alt="Exodus Logo" src={ExodusLogo} height={21} width={21} />
  ),
  walletSupportedFeatures: { createPool: false },
  definition: 'default',
});
