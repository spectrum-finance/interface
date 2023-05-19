import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';
import GeroWalletLogo from './gerowallet-icon.svg';

export const Gero: CardanoWalletContract = makeCardanoWallet({
  variableName: 'gerowallet',
  extensionLink:
    'https://chrome.google.com/webstore/detail/gerowallet/bgpipimickeadkjlklgciifhnalhdjhe/overview',
  walletSupportedFeatures: { createPool: false },
  name: 'Gero Wallet',
  testnetSwitchGuideUrl: '',
  icon: <img alt="Gero Wallet" src={GeroWalletLogo} height={32} width={32} />,
  previewIcon: (
    <img alt="Gero Wallet" src={GeroWalletLogo} width={21} height={21} />
  ),
});
