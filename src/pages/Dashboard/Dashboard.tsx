import { useSearch } from '@ergolabs/ui-kit';
import { useState } from 'react';

import useFetchStats from '../../common/hooks/useFetchStats';
import { useObservable } from '../../common/hooks/useObservable';
import { AmmPool } from '../../common/models/AmmPool';
import { AssetLock } from '../../common/models/AssetLock';
import { Position } from '../../common/models/Position';
import { displayedAmmPools$ } from '../../gateway/api/ammPools';
import { platformStats$ } from '../../gateway/api/platformStats';
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

const formatChangeValue = (change: number): string => {
  const sign = change < 0 ? '-' : '+';
  const formattedChange = `${sign}₳${Math.abs(change).toFixed(2)}`;
  return formattedChange;
};

const findStartOfWeekData = (dataStats: any[], startDateFormat: string) => {
  return dataStats.find((data) => {
    const dataDate = new Date(data.timestamp * 1000);
    const dataDateFormat = `${dataDate.getMonth() + 1}/${dataDate.getDate()}`;
    return dataDateFormat === startDateFormat;
  });
};

const generateFormattedDates = (dates: Date[]): string[] => {
  const formatToMMDD = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month.toString().padStart(2, '0')}/${day
      .toString()
      .padStart(2, '0')}`;
  };
  return dates.map(formatToMMDD);
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

  const { dataStats, loadedStats } = useFetchStats();
  const [currentStats] = useObservable(platformStats$, []);

  let formattedDates: string[] = [];
  let volume: number[] = [];
  let totalValueLocked: number[] = [];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startDate = today;
  startDate.setDate(today.getDate() - dayOfWeek);
  const startDateFormat = `${startDate.getMonth() + 1}/${startDate.getDate()}`;

  let performanceSummaryVolume;
  let performanceSummaryTvl;

  if (loadedStats) {
    const dates = dataStats.map((data) => new Date(data.timestamp * 1000));
    volume = dataStats.map((data) => data.volume);
    totalValueLocked = dataStats.map((data) => data.totalValueLocked);

    const startOfWeekData = findStartOfWeekData(dataStats, startDateFormat);

    if (startOfWeekData) {
      const volumeDifference =
        dataStats[dataStats.length - 1].volume - startOfWeekData.volume;

      const tvlDifference =
        dataStats[dataStats.length - 1].totalValueLocked -
        startOfWeekData.totalValueLocked;

      const percentageChangeVolume = (
        (volumeDifference / startOfWeekData.volume) *
        100
      ).toFixed(2);

      const percentageChangeTvl = (
        (tvlDifference / startOfWeekData.totalValueLocked) *
        100
      ).toFixed(2);

      performanceSummaryVolume = `${formatChangeValue(
        volumeDifference,
      )} (${percentageChangeVolume}%) this week`;

      performanceSummaryTvl = `${formatChangeValue(
        tvlDifference,
      )} (${percentageChangeTvl}%) this week`;
    }

    formattedDates = generateFormattedDates(dates);
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.leftSideContainer}>
          <div className={styles.topChartsContainer}>
            <div className={styles.chart}>
              {loadedStats ? (
                <AreaChart
                  chartProps={{ height: '170px' }}
                  topLeftComponentData={{
                    title: 'Volume',
                    subTitle: `₳ ${currentStats?.volume}`,
                    performanceSummary: `${performanceSummaryVolume}`,
                  }}
                  horizontalLabels={formattedDates}
                  verticalData={{
                    label: 'Volume',
                    data: volume,
                  }}
                />
              ) : (
                <div>Loading</div>
              )}
            </div>
            <div className={styles.chart}>
              <AreaChart
                chartProps={{ height: '150px' }}
                topLeftComponentData={{
                  title: 'TVL ',
                  subTitle: `₳ ${currentStats?.tvl}`,
                  performanceSummary: performanceSummaryTvl,
                }}
                horizontalLabels={formattedDates}
                verticalData={{
                  label: 'TVL',
                  data: totalValueLocked,
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
