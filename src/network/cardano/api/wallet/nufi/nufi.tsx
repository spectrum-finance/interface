import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';
import NufiLogo from './nufi-icon.svg';

export const Nufi: CardanoWalletContract = makeCardanoWallet({
  name: 'Nufi',
  variableName: 'nufi',
  extensionLink:
    'https://chrome.google.com/webstore/detail/nufi/gpnihlnnodeiiaakbikldcihojploeca?hl=en',
  icon: <img alt="Nufi Logo" src={NufiLogo} width={32} height={32} />,
  previewIcon: <img alt="Nufi Logo" src={NufiLogo} width={21} height={21} />,
  walletSupportedFeatures: { createPool: false },
});
