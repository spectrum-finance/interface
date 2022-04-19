import { ReactNode } from 'react';

export interface WalletSupportedFeatures {
  createPool: boolean;
}

export type WalletDefinition = 'experimental' | 'recommended' | 'default';

export interface Wallet {
  readonly name: string;
  readonly icon: ReactNode;
  readonly previewIcon: ReactNode;
  readonly definition: WalletDefinition;
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
