import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';
import GeroLogo from './gerowallet-icon.svg';

export const Gero: CardanoWalletContract = makeCardanoWallet({
  name: 'Gero',
  variableName: 'gerowallet',
  extensionLink:
    'https://chrome.google.com/webstore/detail/gerowallet/bgpipimickeadkjlklgciifhnalhdjhe/overview',
  icon: <img alt="Gero Logo" src={GeroLogo} height={32} width={32} />,
  previewIcon: <img alt="Gero Logo" src={GeroLogo} width={21} height={21} />,
  walletSupportedFeatures: { createPool: false },
});
