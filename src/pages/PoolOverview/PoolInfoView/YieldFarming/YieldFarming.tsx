import { Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC, useEffect, useState } from 'react';
import { firstValueFrom } from 'rxjs';

import { Currency } from '../../../../common/models/Currency.ts';
import { Position } from '../../../../common/models/Position.ts';
import { TitledBox } from '../../../../components/TitledBox/TitledBox.tsx';
import { useAssetsBalance } from '../../../../gateway/api/assetBalance.ts';
import { useApr } from '../../../../network/cardano/api/ammPoolsStats/ammPoolsApr.ts';

export interface YieldFarmingProps {
  readonly position: Position;
}

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

export const YieldFarming: FC<YieldFarmingProps> = ({ position }) => {
  const [balance] = useAssetsBalance();
  const { calculateAPR, isLoading } = useApr(20_000);
  const [rewardAmount, setRewardAmount] = useState<bigint | null>(null);
  const poolId: string = (position.pool as any).poolAnalytics.id;
  const yieldFarmingStartTimestamp = 1701378922;
  const elapsedSeconds = () =>
    Math.floor(Date.now() / 1000) - yieldFarmingStartTimestamp;

  useEffect(() => {
    const yieldFarmingAprByPoolId = async () => {
      try {
        const [, rewardAmount] = (await firstValueFrom(
          calculateAPR(
            poolId,
            position.availableLp.amount,
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

  const assets = (balance as any).mapAssetIdToBalance as Map<string, Currency>;

  const roundOneNfts = [...assets.keys()].filter((assetId) =>
    assetId.startsWith(
      'ab182ed76b669b49ee54a37dee0d0064ad4208a859cc4fdf3f906d87',
    ),
  );

  const roundTwoNfts = [...assets.keys()].filter((assetId) =>
    assetId.startsWith(
      'da3562fad43b7759f679970fb4e0ec07ab5bebe5c703043acda07a3c',
    ),
  );

  const baseReward = Number(convertSubunitToTedy(rewardAmount ?? 0n, 6));

  // Calculate bonuses separately
  const bonusFromRoundOneNFTs = roundOneNfts.length * 0.01;
  const bonusFromRoundTwoNFTs = roundTwoNfts.length * 0.004;

  // Sum the bonuses
  const totalBonusPercentage = bonusFromRoundOneNFTs + bonusFromRoundTwoNFTs;

  // Apply the total bonus to the base reward
  const totalYieldBonus = baseReward * totalBonusPercentage;

  // Calculate the total yield reward
  const totalYieldReward = baseReward + totalYieldBonus;

  return (
    <>
      <TitledBox
        secondary
        glass
        borderRadius="l"
        title={
          <Typography.Body strong>
            <Trans>Yield Farming 🧑‍🌾</Trans>
          </Typography.Body>
        }
        titleGap={1}
        subtitle={
          !position.empty && (
            <Typography.Title level={3}>
              {totalYieldReward.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })}{' '}
              TEDY
            </Typography.Title>
          )
        }
        subtitleGap={2}
        padding={3}
        height={position.empty ? 80 : undefined}
      >
        <Typography.Body>
          Base Reward:{' '}
          <b>
            {baseReward.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
            })}{' '}
            TEDY
          </b>
        </Typography.Body>
        <br />
        <Typography.Body>
          Teddy Bears Club Bonus:{' '}
          <b>
            +{' '}
            {totalYieldBonus.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
            })}{' '}
            TEDY,&nbsp;&nbsp;
            {(
              roundOneNfts.length * 0.01 * 100 +
              roundTwoNfts.length * 0.004 * 100
            ).toLocaleString()}{' '}
            %
          </b>
        </Typography.Body>
        <br />
        <Typography.Body italic>Bonus is applied upon harvest.</Typography.Body>
        <br />
        <Typography.Body italic>
          Disclaimer: This yield farming calculation is a preliminary estimate
          and may be subject to correction or recalculation. While we strive for
          accuracy, there may be errors or necessary adjustments in the final
          figures. Please use this as a guide only.
        </Typography.Body>
      </TitledBox>
    </>
  );
};
