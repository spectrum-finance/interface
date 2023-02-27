import { DepositEvents } from './deposit/events';
import { GeneralEvents } from './generalEvents';
import { RedeemEvents } from './redeem/events';
import { SwapEvents } from './swap/events';
import { WalletEvents } from './wallet/events';

export type AnalyticsEvents = GeneralEvents &
  SwapEvents &
  DepositEvents &
  RedeemEvents &
  WalletEvents;
