import { AmmPool } from '../../../../common/models/AmmPool';

export interface LiquidityPoolsOverviewProps {
  readonly ammPools: AmmPool[];
  readonly isAmmPoolsLoading?: boolean;
}
