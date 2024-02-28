import { useSearch } from '@ergolabs/ui-kit';
import { useState } from 'react';

import { useObservable } from '../../common/hooks/useObservable';
import { AmmPool } from '../../common/models/AmmPool';
import { AssetLock } from '../../common/models/AssetLock';
import { Position } from '../../common/models/Position';
import { displayedAmmPools$ } from '../../gateway/api/ammPools';
import { positions$ } from '../../gateway/api/positions';
import { PoolsOrPositionsFilterValue } from '../Liquidity/common/components/LiquidityFilter/LiquidityFilter';
import { LiquidityState } from '../Liquidity/common/types/LiquidityState';
import { LiquidityTable } from '../Liquidity/default/LiquidityTable/LiquidityTable';
import { AreaChart } from './AreaChart/AreaChart';
import { BatchersCard } from './BatchersCard/BatchersCard';
import { CoinDetailsCard } from './CoinDetailsCard/CoinDetailsCard';
import styles from './Dashboard.module.less';
import { MarketMoversList } from './MarketMoversList/MarketMoversList';

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

const filterDuplicates = <T extends AmmPool | Position>(items: T[]): T[] => {
  const mapTokensToAmmPool = new Map<string, T>();

  return items.filter((i) => {
    const hash =
      i instanceof AmmPool
        ? `${i.x.asset.id}-${i.y.asset.id}`
        : `${i.pool.x.asset.id}-${i.pool.y.asset.id}`;

    if (mapTokensToAmmPool.has(hash)) {
      return false;
    }
    mapTokensToAmmPool.set(hash, i);

    return true;
  });
};

const Dashboard = () => {
  const [ammPools, isAmmPoolsLoading] = useObservable(
    displayedAmmPools$,
    [],
    [],
  );
  const [
    searchByTerm,
    setSearch,
    // term
  ] = useSearch<AmmPool | Position | AssetLock>(matchItem);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setSearch(e.target.value);

  const [positions, isPositionLoading] = useObservable(positions$, [], []);

  const filterPositions = (positions: Position[]): Position[] => {
    return searchByTerm(positions) as Position[];
  };

  const [
    filters,
    // setFilters
  ] = useState<Set<PoolsOrPositionsFilterValue> | undefined>();

  const filterAmmPools = (pools: AmmPool[]): AmmPool[] => {
    let filteredPools = pools;

    if (!filters?.has(PoolsOrPositionsFilterValue.SHOW_DUPLICATES)) {
      filteredPools = filterDuplicates(filteredPools);
    }
    return searchByTerm(filteredPools) as AmmPool[];
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.leftSideContainer}>
          <div className={styles.topChartsContainer}>
            <div className={styles.chart}>
              <AreaChart
                chartProps={{ height: '150px' }}
                topLeftComponentData={{
                  title: 'Volume',
                  subTitle: '₳6,363,639.46',
                  performanceSummary: '+₳544.03 (+2.03%) this week',
                }}
                horizontalLabels={[
                  '09/22',
                  '09/23',
                  '09/24',
                  '09/25',
                  '09/26',
                  '09/27',
                  '09/28',
                  '09/29',
                  '09/30',
                ]}
                verticalData={{
                  label: 'Volume',
                  data: Array.from(
                    { length: 9 },
                    (
                      _,
                      i, // Adjusted length to match labels
                    ) => Math.floor(Math.random() * (i + 1) * 500),
                  ),
                }}
              />
            </div>
            <div className={styles.chart}>
              <AreaChart
                chartProps={{ height: '150px' }}
                topLeftComponentData={{
                  title: 'TVL ',
                  subTitle: '₳63,514,216.46',
                  performanceSummary: '+₳54,360.03 (+2.03%) today',
                }}
                horizontalLabels={[
                  '09/22',
                  '09/23',
                  '09/24',
                  '09/25',
                  '09/26',
                  '09/27',
                  '09/28',
                  '09/29',
                  '09/30',
                ]}
                verticalData={{
                  label: 'TVL',
                  data: Array.from(
                    { length: 9 },
                    (
                      _,
                      i, // Adjusted length to match labels
                    ) => Math.floor(Math.random() * (i + 1) * 500),
                  ),
                }}
              />
            </div>
          </div>
          <div className={styles.bottomChartsContainer}>
            <div className={styles.bottomChart}>
              <AreaChart
                topLeftAndRightComponent={{
                  left: {
                    title: 'Treasurey',
                  },
                  right: {
                    title: '₳193,930.12',
                    subTitle: 'Treasury Value',
                  },
                }}
                horizontalLabels={[
                  '09/22',
                  '09/23',
                  '09/24',
                  '09/25',
                  '09/26',
                  '09/27',
                  '09/28',
                  '09/29',
                  '09/30',
                ]}
                chartProps={{ height: '150px' }}
                verticalData={{
                  label: 'Treasurey',
                  data: Array.from(
                    { length: 9 },
                    (
                      _,
                      i, // Adjusted length to match labels
                    ) => Math.floor(Math.random() * (i + 1) * 500),
                  ),
                }}
              />
            </div>
            <div className={styles.bottomChart}>
              <AreaChart
                topLeftAndRightComponent={{
                  left: {
                    title: 'Revenue',
                  },
                  right: {
                    title: '₳203,930.12',
                    subTitle: 'Buybacks this week',
                  },
                }}
                horizontalLabels={['09/22', '09/23', '09/24', '09/25', '09/26']}
                chartProps={{ height: '150px' }}
                verticalData={{
                  label: 'Revenue',
                  data: Array.from(
                    { length: 9 },
                    (
                      _,
                      i, // Adjusted length to match labels
                    ) => Math.floor(Math.random() * (i + 1) * 500),
                  ),
                }}
              />
            </div>
          </div>
          <div className={styles.lastCardsContainer}>
            <BatchersCard />
            <CoinDetailsCard />
          </div>
        </div>
        <MarketMoversList />
      </div>
      <div className={styles.poolsOverview}>
        <LiquidityTable
          positions={filterPositions(positions) || []}
          isPositionsEmpty={!positions.length}
          isPositionsLoading={isPositionLoading}
          ammPools={filterAmmPools(ammPools) || []}
          isAmmPoolsLoading={isAmmPoolsLoading}
          activeState={LiquidityState.POOLS_OVERVIEW}
          handleSearchTerm={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default Dashboard;
