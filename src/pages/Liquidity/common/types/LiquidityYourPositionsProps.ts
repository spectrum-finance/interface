import { Position } from '../../../../common/models/Position';

export interface LiquidityYourPositionsProps {
  readonly positions: Position[];
  readonly isPositionsLoading?: boolean;
  readonly isPositionsEmpty: boolean;
}
