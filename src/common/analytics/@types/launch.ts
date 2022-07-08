export type AnalyticsLaunchData = {
  network: string;
  theme: string;
  appSettings: {
    theme: 'light' | 'dark';
    minerFee: number;
  };
  opSettings: {
    ergo?: {
      nitro: number;
      slippage: number;
    };
    cardano?: {
      nitro: number;
      slippage: number;
    };
  };
};
