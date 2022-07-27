import { Position } from '../../../../common/models/Position';

export interface LiquidityLockedPositionsProps {
  readonly positionsWithLocks: Position[];
  readonly showLockedPositions: boolean;
}
