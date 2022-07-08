import { SupportedNetworks } from '../../../network/common/Network';
import { SupportedLocale } from '../../constants/locales';
import { AnalyticsTheme } from './types';

export type AnalyticsLaunchData = {
  network: SupportedNetworks;
  locale: SupportedLocale;
  theme: AnalyticsTheme;
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
