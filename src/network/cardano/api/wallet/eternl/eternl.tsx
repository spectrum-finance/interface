import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';
import EternlLogo from './eternl-icon.svg';

export const Eternl: CardanoWalletContract = makeCardanoWallet({
  name: 'Eternl',
  variableName: 'eternl',
  extensionLink:
    'https://chrome.google.com/webstore/detail/eternlcc/kmhcihpebfmpgmihbkipmjlmmioameka',
  icon: <img alt="Eternl Logo" src={EternlLogo} height={32} width={32} />,
  previewIcon: (
    <img alt="Eternl Logo" src={EternlLogo} width={21} height={21} />
  ),
  walletSupportedFeatures: { createPool: false },
});
