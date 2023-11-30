import { Dictionary, keyBy } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { combineLatest, from, lastValueFrom, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';

import { AnalyticPoolNetwork } from '../ammPools/analyticPoolNetwork';
import { AmmPoolAnalytics, ammPoolsStats$ } from './ammPoolsStats';

const analyticAmmPoolsNetwork = new AnalyticPoolNetwork();

const startReward = 17821782n;
const monthlyDecrease = 375395n;
const totalMonths = 48n;
const secondsInMonth = 2592000n;
const secondsInDay = 86400n;

function getMonthlyRewards(month: number) {
  const monthBigInt = BigInt(month);

  if (monthBigInt < 1n || monthBigInt > totalMonths) {
    throw new Error('Month must be between 1 and ' + String(totalMonths));
  }

  const monthlyReward = startReward - monthlyDecrease * (monthBigInt - 1n);
  let cumulativeReward = 0n;

  for (let i = 1n; i <= monthBigInt; i++) {
    cumulativeReward += startReward - monthlyDecrease * (i - 1n);
  }

  return {
    month: month,
    monthlyDistribution: monthlyReward / 100n,
    cumulativeDistribution: cumulativeReward / 100n,
  };
}

function calculateRewardsForTimeElapsed(secondsElapsed: number) {
  const monthsElapsed = BigInt(secondsElapsed) / secondsInMonth;
  const partialMonthSeconds = BigInt(secondsElapsed) % secondsInMonth;

  if (monthsElapsed >= totalMonths) {
    const totalDistribution = getMonthlyRewards(
      Number(totalMonths),
    ).cumulativeDistribution;
    return totalDistribution;
  }

  let totalRewards =
    monthsElapsed > 0
      ? getMonthlyRewards(Number(monthsElapsed)).cumulativeDistribution
      : 0n;

  if (partialMonthSeconds > 0n) {
    const nextMonthRewards = getMonthlyRewards(
      Number(monthsElapsed) + 1,
    ).monthlyDistribution;
    const dailyRewardRate = nextMonthRewards / (secondsInMonth / secondsInDay);
    const partialRewards =
      (dailyRewardRate * partialMonthSeconds) / secondsInDay;
    totalRewards += partialRewards;
  }

  return totalRewards;
}

const poolDistributionRatios = {
  // Tier 1
  '1c0ad45d50bd0a8c9bb851a9c59c3cb3e1ab2e2a29bd4d61b0e967ca.TEDY_ADA_POOL_IDENTITY': 0.6, // TEDY/ADA

  // Tier 2 (55% of 40% = 22% of total, divided by 4 pairs)
  '18a44dde2d51a57964fedacc77182c45df88f86512c51e8f7eba0eb6.iBTC_ADA_POOL_IDENTITY': 0.055, // ADA/iBTC
  'ed8cc5ae2e5a68d78ecf333e86c466068242bbab2f8fca983a2f53e1.cBTC_ADA_POOL_IDENTITY': 0.055, // ADA/cBTC
  '44de9976b4ef013ec683d49175f6edae92d1feeb2314fa18f060ea39.iUSD_ADA_POOL_IDENTITY': 0.055, // ADA/iUSD
  '672b7b2e1caa394f16d9efb23fb24b892fa5eab8156679da197d8c1c.CHRY_ADA_POOL_IDENTITY': 0.055, // ADA/CHRY

  // Tier 3 (45% of 40% = 18% of total, divided by 7 pairs)
  '03a666d6ad004932bdd9d7e0d5a374262454cd84602bd494c9cd48d6.DJED_ADA_POOL_IDENTITY': 0.02571, // ADA/DJED
  '1f164eea5c242f53cb2df2150fa5ab7ba126350e904ddbcc65226e18.cNETA_ADA_POOL_IDENTITY': 0.02571, // ADA/cNETA
  '0cd54b77ac0d70942895c7f1ebc8bdb06ec2fffbe1da6e26209675d2.FACT_ADA_POOL_IDENTITY': 0.02571, // ADA/FACT
  'c30d7086eeb68050a5b01efc219c5d4b5d5fd38e2e62fd6d7f01ac4d.AADA_ADA_POOL_IDENTITY': 0.02571, // ADA/LENFI
  '5d137c35eb5cba295aae2c44e0d9a82ca9f3d362caf3d681ffc9328b.ENCS_ADA_POOL_IDENTITY': 0.02571, // ADA/ENCS
  '8d17d7a368cf5d1a3fe4468735050fdb8d2ae2bb2666aca05edd6969.SNEK_ADA_POOL_IDENTITY': 0.02571, // ADA/SNEK
  // Assuming ADA/iETH and ADA/INDY are included in the pool IDs from your file
  '8d17d7a368cf5d1a3fe4468735050fdb8d2ae2bb2666aca05edd6969.pool_ID_for_ADA_iETH': 0.02571, // Placeholder for ADA/iETH
  '8d17d7a368cf5d1a3fe4468735050fdb8d2ae2bb2666aca05edd6969.pool_ID_for_ADA_INDY': 0.02571, // Placeholder for ADA/INDY
};

function calculateAPR(
  poolId: string,
  ammPoolStats: Dictionary<AmmPoolAnalytics>,
  analyticsPoolData: Dictionary<AmmPoolAnalytics>,
  elapsedSeconds = 2592000n * 12n,
  userLPAmount?: bigint,
): Observable<[bigint, bigint]> {
  const conversionRate = BigInt(1e6);
  const rewardsInTedy$ = of(
    calculateRewardsForTimeElapsed(Number(elapsedSeconds)),
  );
  const priceTedyInAda = 1.44;
  const priceTedyInAdaScaled = BigInt(Math.floor(priceTedyInAda * 1e6));

  return combineLatest([
    of(ammPoolStats),
    of(analyticsPoolData),
    rewardsInTedy$,
  ]).pipe(
    switchMap(([ammPoolsStats, analyticPoolsData, rewardsInTedy]) => {
      const ammPoolData = ammPoolsStats[poolId];
      const analyticPoolData = analyticPoolsData[poolId];

      if (
        !ammPoolData ||
        !analyticPoolData ||
        typeof analyticPoolData.lockedLQ?.amount !== 'string'
      ) {
        throw new Error(
          `Data for pool with ID ${poolId} is incomplete or missing.`,
        );
      }

      const totalLPTokens = BigInt(analyticPoolData.lockedLQ.amount);
      const poolTVLInLovelace = BigInt(
        Math.floor(Number(ammPoolData.tvl) * Number(conversionRate)),
      );

      const scaleFactor = BigInt(1e18);
      const reward = rewardsInTedy;
      const ratioScaled = BigInt(
        Math.round(poolDistributionRatios[poolId] * 1e18),
      );

      const poolReward = (reward * ratioScaled) / scaleFactor;

      const rewardsInAda = (poolReward * priceTedyInAdaScaled) / conversionRate;

      const rewardsInLovelace = rewardsInAda * conversionRate;
      const userShare =
        ((userLPAmount ?? totalLPTokens) * scaleFactor) / totalLPTokens;
      const userRewardsInLovelace =
        (rewardsInLovelace * userShare) / scaleFactor;
      const userShareOfTVLInLovelace =
        (poolTVLInLovelace * userShare) / scaleFactor;
      const userReward = poolReward * userShare;
      const userAPRPercentage =
        userShareOfTVLInLovelace > 0
          ? (userRewardsInLovelace * 100n) / userShareOfTVLInLovelace
          : 0n;

      return of([userAPRPercentage, userReward / BigInt(1e12)] as [
        bigint,
        bigint,
      ]);
    }),
    catchError((error) => {
      console.error('Error occurred during APR calculation:', error);
      return of([BigInt(0), BigInt(0)] as [bigint, bigint]);
    }),
  );
}

const useApr = (refreshInterval: 20_000) => {
  const [ammPoolsStats, setAmmPoolsStats] = useState<
    Dictionary<AmmPoolAnalytics>
  >({});

  const [analyticsPoolsData, setAnalyticsPoolsData] = useState<
    Dictionary<AmmPoolAnalytics>
  >({});

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    const ammPoolStatsResult = await lastValueFrom(
      ammPoolsStats$.pipe(take(1)),
    );

    if (ammPoolStatsResult !== undefined) setAmmPoolsStats(ammPoolStatsResult);

    const analyticsPoolsDataResult = await lastValueFrom(
      from(analyticAmmPoolsNetwork.request()).pipe(
        map((allPoolsData) => keyBy(allPoolsData, (pool) => pool.id)),
      ),
    );

    setAnalyticsPoolsData(analyticsPoolsDataResult);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, refreshInterval);
    return () => clearInterval(intervalId);
  }, [fetchData, refreshInterval]);

  const getAPRById = (
    poolId: string,
    userLPAmount?: bigint,
    elapsedSeconds?: bigint,
  ): Observable<[bigint, bigint]> => {
    const ammPoolData = ammPoolsStats[poolId];
    const analyticPoolData = analyticsPoolsData[poolId];
    if (!ammPoolData || !analyticPoolData) {
      return of([BigInt(0), BigInt(0)]);
    }

    const calculatedAPR = calculateAPR(
      poolId,
      ammPoolsStats,
      analyticsPoolsData,
      elapsedSeconds,
      userLPAmount,
    );

    return calculatedAPR;
  };

  return { calculateAPR: getAPRById, isLoading };
};

export {
  calculateAPR,
  calculateRewardsForTimeElapsed,
  getMonthlyRewards,
  useApr,
};
