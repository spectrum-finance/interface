import { Flex } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import React, { FC } from 'react';

import { SearchInput } from '../../../components/SearchInput/SearchInput';
import { LiquidityFilter } from '../common/components/LiquidityFilter/LiquidityFilter';
import { LiquidityLayoutProps } from '../common/types/LiquidityLayoutProps';
import { LiquidityState } from '../common/types/LiquidityState';
import { LockedPositions } from './common/LockedPositions/LockedPositions';
import { LiquidityStateSelect } from './components/LiquidityStateSelect/LiquidityStateSelect';
import { PoolsOverview } from './components/PoolsOverview/PoolsOverview';
import { YourPositions } from './components/YourPositions/YourPositions';

export const LiquidityMobileLayout: FC<LiquidityLayoutProps> = ({
  activeState,
  setActiveState,
  ammPools,
  isAmmPoolsLoading,
  filters,
  setFilters,
  term,
  handleSearchTerm,
  positions,
  isPositionsLoading,
  isPositionsEmpty,
  showLockedPositions,
  positionsWithLocks,
}) => (
  <Flex col>
    <Flex.Item marginBottom={2} width="100%">
      <LiquidityStateSelect
        showLockedPositions={showLockedPositions}
        value={activeState}
        onChange={setActiveState}
      />
    </Flex.Item>
    <Flex.Item display="flex" marginBottom={4}>
      <Flex.Item flex={1} marginRight={2}>
        <SearchInput
          size="large"
          value={term}
          onChange={handleSearchTerm}
          placeholder={t`Type token name or pool id`}
        />
      </Flex.Item>
      <LiquidityFilter value={filters} onChange={setFilters} />
    </Flex.Item>
    {activeState === LiquidityState.POOLS_OVERVIEW && (
      <PoolsOverview
        ammPools={ammPools}
        isAmmPoolsLoading={isAmmPoolsLoading}
      />
    )}
    {activeState === LiquidityState.YOUR_POSITIONS && (
      <YourPositions
        positions={positions}
        isPositionsEmpty={isPositionsEmpty}
        isPositionsLoading={isPositionsLoading}
      />
    )}
    {activeState === LiquidityState.LOCKED_POSITIONS && showLockedPositions && (
      <LockedPositions
        positionsWithLocks={positionsWithLocks}
        showLockedPositions={showLockedPositions}
      />
    )}
  </Flex>
);
