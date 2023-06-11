import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';
import TyphonLogo from './typhon-icon.svg';

export const Typhon: CardanoWalletContract = makeCardanoWallet({
  name: 'Typhon',
  variableName: 'typhon',
  extensionLink:
    'https://chrome.google.com/webstore/detail/typhon-wallet/kfdniefadaanbjodldohaedphafoffoh',
  walletSupportedFeatures: { createPool: false },
  icon: <img alt="Typhon Logo" src={TyphonLogo} height={32} width={32} />,
  previewIcon: (
    <img alt="Typhon Logo" src={TyphonLogo} height={21} width={21} />
  ),
});
