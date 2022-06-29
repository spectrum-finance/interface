import './Pool.less';

import { Flex, Input, SearchOutlined, Tabs, useSearch } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import React, { useState } from 'react';
import styled from 'styled-components';

import { useObservable } from '../../common/hooks/useObservable';
import { useSearchParams } from '../../common/hooks/useSearchParams';
import { AmmPool } from '../../common/models/AmmPool';
import { AssetLock } from '../../common/models/AssetLock';
import { Position } from '../../common/models/Position';
import { Page } from '../../components/Page/Page';
import { ammPools$ } from '../../gateway/api/ammPools';
import { positions$ } from '../../gateway/api/positions';
import {
  LiquidityFilter,
  PoolsOrPositionsFilterValue,
} from './components/LiquidityFilter/LiquidityFilter';
import { LiquidityTitleExtra } from './components/LiquidityTitleExtra/LiquidityTitleExtra';
import { LockedPositionsProps } from './components/LockedPositions/LockedPositions';
import { PoolsOverview } from './components/PoolsOverview/PoolsOverview';
import { YourPositions } from './components/YourPositions/YourPositions';

enum LiquidityTab {
  POOLS_OVERVIEW = 'positions-overview',
  YOUR_POSITIONS = 'your-positions',
  LOCKED_POSITIONS = 'locked-positions',
}

const matchItem = (
  item: AmmPool | Position | AssetLock,
  term?: string,
): boolean => {
  if (item instanceof AmmPool) {
    return item.match(term);
  }
  if (item instanceof Position) {
    return item.match(term);
  }
  return item.position.match(term);
};

const LiquidityTabs = styled(Tabs)`
  .ant-tabs-nav-wrap {
    flex: initial !important;
    margin-right: calc(var(--ergo-base-gutter) * 2);
  }

  .ant-tabs-nav {
    margin-bottom: calc(var(--ergo-base-gutter) * 2) !important;
  }

  .ant-tabs-extra-content {
    flex: 1;
  }
`;

const filterDuplicates = <T extends AmmPool | Position>(items: T) => {
  return items;
};

const filterCommunityPools = <T extends AmmPool | Position>(items: T) => {
  return items;
};

const mapPoolsOrPositionsFilterValueToFn = {
  [PoolsOrPositionsFilterValue.SHOW_COMMUNITY_POOLS]: filterCommunityPools,
  [PoolsOrPositionsFilterValue.SHOW_DUPLICATES]: filterDuplicates,
};

export const Liquidity = (): JSX.Element => {
  const [filters, setFilters] = useState<
    Set<PoolsOrPositionsFilterValue> | undefined
  >();

  const [{ active }, setSearchParams] =
    useSearchParams<{ active: string | undefined }>();
  const [searchByTerm, setSearch] = useSearch<AmmPool | Position | AssetLock>(
    matchItem,
  );

  const [positions, isPositionLoading] = useObservable(positions$, [], []);

  const [pools, isPoolsLoading] = useObservable(ammPools$, [], []);

  const defaultActiveKey = active || LiquidityTab.POOLS_OVERVIEW;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  const positionsWithLocks = positions?.filter((p) => p.locks.length > 0);

  return (
    <Page
      width={944}
      padding={4}
      title={<Trans>Liquidity</Trans>}
      titleChildren={<LiquidityTitleExtra />}
    >
      <LiquidityTabs
        tabBarExtraContent={{
          right: (
            <Flex>
              <Flex.Item flex={1} marginRight={1}>
                <Input
                  autoFocus
                  onChange={handleSearchChange}
                  prefix={<SearchOutlined />}
                  placeholder={t`Type token name or pool id`}
                  size="large"
                />
              </Flex.Item>
              <LiquidityFilter value={filters} onChange={setFilters} />
            </Flex>
          ),
        }}
        defaultActiveKey={defaultActiveKey}
        onChange={(active) => setSearchParams({ active })}
      >
        <Tabs.TabPane
          tab={<Trans>Pools Overview</Trans>}
          key={LiquidityTab.POOLS_OVERVIEW}
        >
          <PoolsOverview
            ammPools={(searchByTerm(pools) as AmmPool[]) || []}
            loading={isPoolsLoading}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={<Trans>Your Positions</Trans>}
          key={LiquidityTab.YOUR_POSITIONS}
        >
          <YourPositions
            positions={(searchByTerm(positions) as Position[]) || []}
            loading={isPositionLoading}
          />
        </Tabs.TabPane>
        {positionsWithLocks.length && (
          <Tabs.TabPane
            tab={<Trans>Locked Positions</Trans>}
            key={LiquidityTab.LOCKED_POSITIONS}
          >
            <LockedPositionsProps
              positions={searchByTerm(positionsWithLocks) as Position[]}
            />
          </Tabs.TabPane>
        )}
      </LiquidityTabs>
    </Page>
  );
};

// 1. Filter
// 3. Connect Wallet
// 4. Locks Search state
