import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';
import ExodusLogo from './exodus-icon.svg';

export const Exodus: CardanoWalletContract = makeCardanoWallet({
  name: 'Exodus',
  variableName: 'exodus',
  extensionLink:
    'https://chrome.google.com/webstore/detail/exodus-web3-wallet/aholpfdialjgjfhomihkjbmgjidlcdno',
  icon: <img alt="Exodus Logo" src={ExodusLogo} height={32} width={32} />,
  previewIcon: (
    <img alt="Exodus Logo" src={ExodusLogo} height={21} width={21} />
  ),
  walletSupportedFeatures: { createPool: false },
});
