import { SupportedNetworks } from '../../../network/common/Network';
import { SupportedLocale } from '../../constants/locales';
import { AnalyticsTheme } from './types';

export type AnalyticsLaunchData = {
  network: SupportedNetworks;
  locale: SupportedLocale;
  theme: AnalyticsTheme;
  ergo_nitro?: number;
  ergo_slippage?: number;
  ergo_minerFee?: number;
  ergo_wallet?: string;
  cardano_nitro: number;
  cardano_slippage: number;
  cardano_wallet?: string;
};
