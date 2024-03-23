import { Button, Flex, Tabs } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { IsErgo } from '../../../components/IsErgo/IsErgo.tsx';
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
    justify-content: space-between;
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
  const navigate = useNavigate();
  const LiquidityStateCaptions = {
    [LiquidityState.POOLS_OVERVIEW]: t`Overview`,
    [LiquidityState.YOUR_POSITIONS]: t`My Liquidity`,
    [LiquidityState.LOCKED_POSITIONS]: t`Locked Liquidity`,
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
            <Flex.Item marginRight={1}>
              <LiquidityFilter value={filters} onChange={setFilters} />
            </Flex.Item>
            <IsErgo>
              <Button
                size="large"
                onClick={() => {
                  navigate('create');
                }}
              >
                <Trans>Create Pool</Trans>
              </Button>
            </IsErgo>
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
