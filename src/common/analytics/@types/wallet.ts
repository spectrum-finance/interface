import { SupportedNetworks } from '../../../network/common/Network';

export type AnalyticsWalletName = string;

export type AnalyticsWallet = {
  network: SupportedNetworks;
  name: AnalyticsWalletName;
  activeAddress: string;
  addresses: string[];
  balance: number;
};
