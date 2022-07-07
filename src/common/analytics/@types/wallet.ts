import { SupportedNetworks } from '../../../network/common/Network';

export type AnalyticsWallet = {
  network: SupportedNetworks;
  name: string;
  activeAddress: string;
  addresses: string[];
};

export type AnalyticsConnectWalletLocation =
  | 'header'
  | 'swap'
  | 'pool-list'
  | 'your-positions-list'
  | 'add-liquidity'
  | 'create-pool'
  | 'withdrawal-liquidity'
  | 'relock-liquidity';
