import { LiquidityState } from './LiquidityState';

export interface LiquidityActiveStateProps {
  readonly activeState: LiquidityState;
  readonly setActiveState: (state: LiquidityState) => void;
}
