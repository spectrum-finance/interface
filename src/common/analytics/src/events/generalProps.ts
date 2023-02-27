export type WebVitalsProps =
  | { cumulative_layout_shift: number }
  | { first_contentful_paint_ms: number }
  | { first_input_delay_ms: number }
  | { largest_contentful_paint_ms: number };

export type AmmPoolProps = {
  amm_pool_id: string;
  amm_pool_name: string;
  amm_pool_tvl: number;
  amm_pool_fee: number;
};

export type TokenProps = {
  token_name: string;
  toke_id: string;
};

export type LiquidityOperationBasedProps = {
  x_name: string;
  x_amount: number;
  x_usd: number;
  y_name: string;
  y_amount: number;
  y_usd: number;
  lp_usd: number;
};

export type OperationSettingsProps = {
  settings_slippage: number;
  settings_nitro: number;
  settings_fee_currency: 'erg' | 'spf';
};

export type ErrorProps = {
  error_string: string;
};

export type ElementLocationProps = {
  element_location:
    | 'header'
    | 'footer'
    | 'swap-form'
    | 'deposit-form'
    | 'redeem-form'
    | 'pool-overview-list'
    | 'create-pool-form'
    | 'your-positions-list'
    | 'withdrawal-liquidity-form'
    | 'relock-liquidity-form'
    | 'chaining-modal';
};

export type LocaleProps = {
  locale: string;
};

export type NetworkProps = {
  network: 'ergo' | 'cardano';
};

export type ThemeProps = {
  theme: 'light' | 'dark' | 'system';
};
