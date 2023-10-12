import { useDevice, useSearch } from '@ergolabs/ui-kit';
import { useState } from 'react';
import * as React from 'react';

import { useObservable } from '../../common/hooks/useObservable';
import { useSearchParams } from '../../common/hooks/useSearchParams';
import { AmmPool } from '../../common/models/AmmPool';
import { AssetLock } from '../../common/models/AssetLock';
import { Position } from '../../common/models/Position';
import { Page } from '../../components/Page/Page';
import { displayedAmmPools$ } from '../../gateway/api/ammPools';
import { positions$ } from '../../gateway/api/positions';
import { showUnverifiedPools$ } from '../../network/cardano/api/ammPools/ammPools';
import { PoolsOrPositionsFilterValue } from './common/components/LiquidityFilter/LiquidityFilter';
import { LiquidityState } from './common/types/LiquidityState';
import { LiquidityDefaultLayout } from './default/LiquidityDefaultLayout';
import { LiquidityMobileLayout } from './mobile/LiquidityMobileLayout';

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

export const Liquidity = (): JSX.Element => {
  const [filters, setFilters] = useState<
    Set<PoolsOrPositionsFilterValue> | undefined
  >(
    showUnverifiedPools$.getValue()
      ? new Set([PoolsOrPositionsFilterValue.SHOW_UNVERIFIED_POOLS])
      : undefined,
  );

  const { moreThan, s } = useDevice();

  const [{ active }, setSearchParams] =
    useSearchParams<{ active: LiquidityState | undefined }>();
  const [searchByTerm, setSearch, term] = useSearch<
    AmmPool | Position | AssetLock
  >(matchItem);

  const [positions, isPositionLoading] = useObservable(positions$, [], []);

  const [ammPools, isAmmPoolsLoading] = useObservable(
    displayedAmmPools$,
    [],
    [],
  );

  const activeState =
    isPositionLoading && active === LiquidityState.LOCKED_POSITIONS
      ? LiquidityState.POOLS_OVERVIEW
      : active || LiquidityState.POOLS_OVERVIEW;

  const setActiveState = (active: LiquidityState) =>
    setSearchParams({ active });

  const filterPositions = (positions: Position[]): Position[] => {
    return searchByTerm(positions) as Position[];
  };

  const filterLockedPositions = (positions: Position[]): Position[] => {
    return searchByTerm(positions) as Position[];
  };

  const filterAmmPools = (pools: AmmPool[]): AmmPool[] => {
    let filteredPools = pools;

    if (!filters?.has(PoolsOrPositionsFilterValue.SHOW_DUPLICATES)) {
      filteredPools = filterDuplicates(filteredPools);
    }
    return searchByTerm(filteredPools) as AmmPool[];
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setSearch(e.target.value);
  const positionsWithLocks = positions?.filter((p) => !!p.locks.length);

  return (
    <Page maxWidth={1008} padding={0} transparent>
      {s && (
        <LiquidityMobileLayout
          activeState={activeState}
          setActiveState={setActiveState}
          filters={filters}
          term={term}
          handleSearchTerm={handleSearchChange}
          setFilters={setFilters}
          ammPools={filterAmmPools(ammPools) || []}
          isAmmPoolsLoading={isAmmPoolsLoading}
          positions={filterPositions(positions) || []}
          isPositionsEmpty={!positions.length}
          isPositionsLoading={isPositionLoading}
          showLockedPositions={positionsWithLocks.length > 0}
          positionsWithLocks={filterLockedPositions(positionsWithLocks)}
        />
      )}
      {moreThan('m') && (
        <LiquidityDefaultLayout
          activeState={activeState}
          setActiveState={setActiveState}
          filters={filters}
          term={term}
          handleSearchTerm={handleSearchChange}
          setFilters={setFilters}
          ammPools={filterAmmPools(ammPools) || []}
          isAmmPoolsLoading={isAmmPoolsLoading}
          positions={filterPositions(positions) || []}
          isPositionsEmpty={!positions.length}
          isPositionsLoading={isPositionLoading}
          showLockedPositions={positionsWithLocks.length > 0}
          positionsWithLocks={filterLockedPositions(positionsWithLocks)}
        />
      )}
    </Page>
  );
};
