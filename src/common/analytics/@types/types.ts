import * as Amplitude from '@amplitude/analytics-browser';
import { PostHog } from 'posthog-js';

export type ProductAnalyticsConfig = {
  apiKey: string;
  analyticsSystem: ProductAnalyticsSystem;
};

export interface ProductAnalyticsSystem {
  name: string;
  system: PostHog | typeof Amplitude;
  apiKey?: string;
  apiUrl?: string;
  init(): Promise<void>;
  captureEvent(
    name: string,
    props?: Record<string, unknown>,
    userProps?: userProperties,
  ): void;
}

export type userProperties = {
  set?: Record<string, any>;
  setOnce?: Record<string, any>;
};

export type AnalyticsWalletName = string;

export type AnalyticsTheme = 'light' | 'dark' | 'system';

export type AnalyticsAppOperations =
  | 'swap'
  | 'deposit'
  | 'redeem'
  | 'refund'
  | 'lock'
  | 'relock'
  | 'lock-withdrawal'
  | 'create-pool';

export type AnalyticsTokenAssignment = 'from' | 'to' | 'x' | 'y';

export type AnalyticsToken = {
  tokenName?: string;
  tokenId?: string;
};

export type AnalyticsElementLocation =
  | 'header'
  | 'footer'
  | 'swap'
  | 'pool-list'
  | 'your-positions-list'
  | 'add-liquidity'
  | 'create-pool'
  | 'withdrawal-liquidity'
  | 'relock-liquidity'
  | 'chaining-modal'
  | 'pool-overview';

export type AnalyticsPoolData = {
  pool_id?: string;
  pool_name?: string;
  tvl?: number;
  pool_fee?: number;
};

export type AnalyticsSwapSettingsData = {
  swap_settings_slippage: number;
  swap_settings_nitro: number;
};

export type AnalyticsSwapData = {
  from_name?: string;
  from_amount?: number;
  from_usd?: number;
  from_id?: string;
  to_name?: string;
  to_amount?: number;
  to_usd?: number;
  to_id?: string;
};

export type AnalyticsDepositData = {
  x_name?: string;
  x_amount?: number;
  x_usd?: number;
  y_name?: string;
  y_amount?: number;
  y_usd?: number;
  liquidity_usd?: number;
};

export type AnalyticsRedeemData = {
  percent_of_liquidity?: number;
  x_name?: string;
  x_amount?: number;
  x_usd?: number;
  y_name?: string;
  y_amount?: number;
  y_usd?: number;
  lp_amount?: number;
  liquidity_usd?: number;
};

export type PAnalytics = {
  location?: AnalyticsElementLocation;
  operation?: AnalyticsAppOperations;
  tokenAssignment?: AnalyticsTokenAssignment;
};
