import { t } from '@lingui/macro';

export enum LiquidityState {
  POOLS_OVERVIEW = 'positions-overview',
  YOUR_POSITIONS = 'your-positions',
  LOCKED_POSITIONS = 'locked-positions',
}

export const LiquidityStateCaptions = {
  [LiquidityState.POOLS_OVERVIEW]: t`Pools Overview`,
  [LiquidityState.YOUR_POSITIONS]: t`Your Positions`,
  [LiquidityState.LOCKED_POSITIONS]: t`Locked Positions`,
};
