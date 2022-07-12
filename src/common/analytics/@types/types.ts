export type $Set<T> = {
  $set: T;
};

export type $SetOnce<T> = {
  $set_once: T;
};

export type PAnalytics = {
  location?: AnalyticsElementLocation;
  operation?: AnalyticsAppOperations;
  tokenAssignment?: AnalyticsTokenAssignment;
};

export type AnalyticsTheme = 'light' | 'dark';

export type AnalyticsAppOperations =
  | 'swap'
  | 'deposit'
  | 'redeem'
  | 'refund'
  | 'lock'
  | 'relock'
  | 'lock-withdrawal';

export type AnalyticsTokenAssignment = 'from' | 'to' | 'x' | 'y';

export type AnalyticsToken = {
  tokenName: string;
  tokenId: string;
};

export type AnalyticsElementLocation =
  | 'header'
  | 'swap'
  | 'pool-list'
  | 'your-positions-list'
  | 'add-liquidity'
  | 'create-pool'
  | 'withdrawal-liquidity'
  | 'relock-liquidity';

export type AnalyticsPoolData = {
  pool_id: string;
  pool_name: string;
  tvl: string;
  pool_fee: number;
};

export type AnalyticsGlobalSettingsData = {
  settings_miner_fee: number;
};

export type AnalyticsSwapSettingsData = {
  swap_settings_slippage: number;
  swap_settings_nitro: number;
};

export type AnalyticsSwapData = {
  from_token_name?: string;
  from_amount?: number;
  from_usd?: number;
  from_token_id?: string;
  to_token_name?: string;
  to_amount?: number;
  to_usd?: number;
  to_token_id?: string;
};
