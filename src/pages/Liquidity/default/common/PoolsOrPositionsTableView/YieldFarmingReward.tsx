import { FC, useEffect, useState } from 'react';
import { firstValueFrom, Observable } from 'rxjs';

import { Currency } from '../../../../../common/models/Currency';
import { useAssetsBalance } from '../../../../../gateway/api/assetBalance';

function convertSubunitToTedy(subunitAmount: bigint, scale = 6) {
  const factor = BigInt('1' + '0'.repeat(scale)); // Creates a BigInt factor for scaling
  const scaledAmount = subunitAmount * factor; // Scale up to maintain precision
  const dividedAmount = scaledAmount / 1000000n; // Perform the division

  // Convert the BigInt to a string
  let dividedStr = dividedAmount.toString();

  // Pad the string with leading zeros if it's shorter than scale + 1
  while (dividedStr.length <= scale) {
    dividedStr = '0' + dividedStr;
  }

  // Insert the decimal point
  const tedyAmount =
    dividedStr.slice(0, -scale) + '.' + dividedStr.slice(-scale);

  return tedyAmount;
}

export const YieldFarmingReward: FC<{
  infoPool: any;
  infoPosition: any;
  isLoading: boolean;
  calculateAPR: (
    poolId: string,
    userLPAmount?: bigint | undefined,
    elapsedSeconds?: bigint | undefined,
  ) => Observable<[bigint, bigint]>;
}> = ({ infoPool, infoPosition, calculateAPR, isLoading }) => {
  const [balance] = useAssetsBalance();
  const [rewardAmount, setRewardAmount] = useState<bigint | null>(null);

  const yieldFarmingStartTimestamp = 1701378922;
  const elapsedSeconds = () =>
    Math.floor(Date.now() / 1000) - yieldFarmingStartTimestamp;

  const poolId: string | undefined | null =
    infoPool.pool.id.policyId + '.' + infoPool.pool.id.name;

  console.log(poolId);

  let totalYieldReward = 0;
  let baseReward = 0;
  let totalYieldBonus = 0;
  let totalBonusPercentage = 0;
  let roundOneNfts: string[] = [];
  let roundTwoNfts: string[] = [];

  useEffect(() => {
    const yieldFarmingAprByPoolId = async () => {
      try {
        const [, rewardAmount] = (await firstValueFrom(
          calculateAPR(
            poolId ?? '',
            infoPosition.availableLp.amount,
            BigInt(elapsedSeconds()),
          ),
        )) as [bigint, bigint];
        setRewardAmount(rewardAmount);
      } catch (error) {
        console.error(error);
      }
    };

    const interval = setInterval(() => {
      yieldFarmingAprByPoolId();
    }, 1000);

    yieldFarmingAprByPoolId();

    return () => clearInterval(interval);
  }, [isLoading]);

  if (poolId != undefined || poolId != null) {
    const assets = (balance as any).mapAssetIdToBalance as Map<
      string,
      Currency
    >;

    roundOneNfts = [...assets.keys()].filter((assetId) =>
      assetId.startsWith(
        'ab182ed76b669b49ee54a37dee0d0064ad4208a859cc4fdf3f906d87',
      ),
    );

    roundTwoNfts = [...assets.keys()].filter((assetId) =>
      assetId.startsWith(
        'da3562fad43b7759f679970fb4e0ec07ab5bebe5c703043acda07a3c',
      ),
    );

    baseReward = Number(convertSubunitToTedy(rewardAmount ?? 0n, 6));

    // Calculate bonuses separately
    const bonusFromRoundOneNFTs =
      roundOneNfts.length >= 30 ? 30 * 0.01 : roundOneNfts.length * 0.01;
    const bonusFromRoundTwoNFTs =
      roundTwoNfts.length >= 30 ? 30 * 0.004 : roundTwoNfts.length * 0.004;

    // Sum the bonuses
    totalBonusPercentage = bonusFromRoundOneNFTs + bonusFromRoundTwoNFTs;

    // Apply the total bonus to the base reward
    totalYieldBonus = baseReward * totalBonusPercentage;

    // Calculate the total yield reward
    totalYieldReward = baseReward + totalYieldBonus;
  }
  console.log(totalYieldReward);
  return (
    <>{totalYieldReward >= 0 ? `${totalYieldReward.toFixed(6)} TEDY` : '-'}</>
  );
};
