import { PoolsOrPositionsFilterValue } from '../components/LiquidityFilter/LiquidityFilter';

export interface LiquidityFiltersProps {
  readonly filters: Set<PoolsOrPositionsFilterValue> | undefined;
  readonly setFilters: (
    filters: Set<PoolsOrPositionsFilterValue> | undefined,
  ) => void;
}
