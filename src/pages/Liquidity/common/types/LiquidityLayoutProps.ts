import { LiquidityActiveStateProps } from './LiquidityActiveStateProps';
import { LiquidityFiltersProps } from './LiquidityFilterProps';
import { LiquidityLockedPositionsProps } from './LiquidityLockedPositionsProps';
import { LiquidityPoolsOverviewProps } from './LiquidityPoolsOverviewProps';
import { LiquiditySearchProps } from './LiquiditySearchProps';
import { LiquidityYourPositionsProps } from './LiquidityYourPositionsProps';

export type LiquidityLayoutProps = LiquidityPoolsOverviewProps &
  LiquidityYourPositionsProps &
  LiquidityLockedPositionsProps &
  LiquidityFiltersProps &
  LiquiditySearchProps &
  LiquidityActiveStateProps;
