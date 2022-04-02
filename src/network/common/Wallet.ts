import { ReactNode } from 'react';

export interface WalletSupportedFeatures {
  createPool: boolean;
}

export interface Wallet {
  readonly name: string;
  readonly icon: ReactNode;
  readonly definition: 'experimental' | 'recommended' | 'default';
  readonly extensionLink: string;
  readonly onConnect?: () => void;
  readonly onDisconnect?: () => void;
  readonly walletSupportedFeatures: WalletSupportedFeatures;
}

export enum WalletState {
  NOT_CONNECTED,
  CONNECTING,
  CONNECTED,
}
