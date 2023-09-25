import { AdditionalData } from '../common/AdditionalData';
import { createWallet } from '../common/Wallet';
import TyphonLogo from './typhon-icon.svg';

export const Typhon = createWallet<AdditionalData>({
  id: 'Typhon',
  getConnector: () => cardano.typhoncip30,
  name: 'Typhon',
  extensionLink:
    'https://chrome.google.com/webstore/detail/typhon-wallet/kfdniefadaanbjodldohaedphafoffoh',
  walletSupportedFeatures: { createPool: false },
  icon: <img alt="Typhon Logo" src={TyphonLogo} height={32} width={32} />,
  previewIcon: (
    <img alt="Typhon Logo" src={TyphonLogo} height={21} width={21} />
  ),
  definition: 'default',
});
