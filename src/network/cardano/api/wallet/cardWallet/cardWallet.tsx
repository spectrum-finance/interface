import { CardanoWalletContract } from '../common/CardanoWalletContract';
import { makeCardanoWallet } from '../common/makeCardanoWallet';
import { ReactComponent as CardWalletLogo } from './cardwallet-icon.svg';

export const CardWallet: CardanoWalletContract = makeCardanoWallet({
  variableName: 'cardwallet',
  extensionLink:
    'https://chrome.google.com/webstore/detail/cwallet/apnehcjmnengpnmccpaibjmhhoadaico',
  walletSupportedFeatures: { createPool: false },
  name: 'CardWallet',
  testnetSwitchGuideUrl:
    'https://docs.spectrum.fi/docs/user-guides/change-wallet-to-testnet#cardwallet',
  icon: <CardWalletLogo />,
  previewIcon: <CardWalletLogo width={21} height={21} />,
});
