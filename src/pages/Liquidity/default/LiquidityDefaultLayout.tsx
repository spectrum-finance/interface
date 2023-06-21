import { Flex, Tabs } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { FC } from 'react';
import styled from 'styled-components';

import { SearchInput } from '../../../components/SearchInput/SearchInput';
import { LiquidityFilter } from '../common/components/LiquidityFilter/LiquidityFilter';
import { LiquidityLayoutProps } from '../common/types/LiquidityLayoutProps';
import { LiquidityState } from '../common/types/LiquidityState';
import { LockedPositions } from './components/LockedPositions/LockedPositions';
import { PoolsOverview } from './components/PoolsOverview/PoolsOverview';
import { YourPositions } from './components/YourPositions/YourPositions';

const LiquidityTabs = styled(Tabs)`
  .ant-tabs-nav-wrap {
    flex: initial !important;
    margin-right: calc(var(--spectrum-base-gutter) * 2);
  }

  .ant-tabs-nav {
    margin-bottom: calc(var(--spectrum-base-gutter) * 2) !important;
  }

  .ant-tabs-extra-content {
    flex: 1;
  }
`;

export const LiquidityDefaultLayout: FC<LiquidityLayoutProps> = ({
  ammPools,
  isAmmPoolsLoading,
  term,
  handleSearchTerm,
  filters,
  setFilters,
  activeState,
  setActiveState,
  positions,
  isPositionsEmpty,
  isPositionsLoading,
  positionsWithLocks,
  showLockedPositions,
}) => {
  const LiquidityStateCaptions = {
    [LiquidityState.POOLS_OVERVIEW]: t`All Pools`,
    [LiquidityState.YOUR_POSITIONS]: t`Your Positions`,
    [LiquidityState.LOCKED_POSITIONS]: t`Locked Positions`,
  };

  return (
    <LiquidityTabs
      glass
      tabBarExtraContent={{
        right: (
          <Flex>
            <Flex.Item flex={1} marginRight={1}>
              <SearchInput
                autoFocus
                onChange={handleSearchTerm}
                value={term}
                placeholder={t`Type token name or pool id`}
                size="large"
              />
            </Flex.Item>
            <LiquidityFilter value={filters} onChange={setFilters} />
          </Flex>
        ),
      }}
      activeKey={activeState}
      onChange={setActiveState as any}
    >
      <Tabs.TabPane
        tab={t`${LiquidityStateCaptions[LiquidityState.POOLS_OVERVIEW]}`}
        key={LiquidityState.POOLS_OVERVIEW}
      >
        <PoolsOverview ammPools={ammPools} loading={isAmmPoolsLoading} />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={t`${LiquidityStateCaptions[LiquidityState.YOUR_POSITIONS]}`}
        key={LiquidityState.YOUR_POSITIONS}
      >
        <YourPositions
          positions={positions}
          isPositionsEmpty={isPositionsEmpty}
          isPositionsLoading={isPositionsLoading}
        />
      </Tabs.TabPane>
      {showLockedPositions && (
        <Tabs.TabPane
          tab={t`${LiquidityStateCaptions[LiquidityState.LOCKED_POSITIONS]}`}
          key={LiquidityState.LOCKED_POSITIONS}
        >
          <LockedPositions
            positionsWithLocks={positionsWithLocks}
            showLockedPositions={showLockedPositions}
          />
        </Tabs.TabPane>
      )}
    </LiquidityTabs>
  );
};
