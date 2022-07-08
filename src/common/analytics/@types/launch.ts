export type AnalyticsLaunchData = {
  network: string;
  locale: string;
  theme: 'light' | 'dark';
  ergo?: {
    nitro: number;
    slippage: number;
    minerFee: number;
    wallet?: string;
  };
  cardano?: {
    nitro: number;
    slippage: number;
    wallet?: string;
  };
};
