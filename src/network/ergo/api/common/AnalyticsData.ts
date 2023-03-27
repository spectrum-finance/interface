export interface CurrencyInfo {
  id: string;
  decimals: number;
}

export interface Units {
  currency: CurrencyInfo;
}

export interface AnalyticsData {
  value: number;
  units: Units;
}
