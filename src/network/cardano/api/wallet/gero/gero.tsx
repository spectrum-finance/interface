import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';
import GeroWalletLogo from './gerowallet-icon.svg';

export const Gero: CardanoWalletContract = makeCardanoWallet({
  variableName: 'gerowallet',
  extensionLink:
    'https://chrome.google.com/webstore/detail/gerowallet-preview/iifeegfcfhlhhnilhfoeihllenamcfgc',
  walletSupportedFeatures: { createPool: false },
  name: 'GeroWallet Preview',
  testnetSwitchGuideUrl: '',
  icon: <img src={GeroWalletLogo} height={32} width={32} />,
  previewIcon: <img src={GeroWalletLogo} width={21} height={21} />,
});
