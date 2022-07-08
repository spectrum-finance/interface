import { SupportedNetworks } from '../../../network/common/Network';
import { SupportedLocale } from '../../constants/locales';

export type AnalyticsLaunchData = {
  network: SupportedNetworks;
  locale: SupportedLocale;
  theme: 'light' | 'dark';
  minerFee: number;
  ergo?: {
    nitro: number;
    slippage: number;
  };
  cardano?: {
    nitro: number;
    slippage: number;
  };
};
