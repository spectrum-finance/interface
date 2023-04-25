import { Box, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC, useEffect, useState } from 'react';

import { useObservable } from '../../../../../../common/hooks/useObservable';
import { Farm, FarmStatus } from '../../../../../../common/models/Farm';
import { AssetIcon } from '../../../../../../components/AssetIcon/AssetIcon';
import { ConvenientAssetView } from '../../../../../../components/ConvenientAssetView/ConvenientAssetView';
import { isWalletSetuped$ } from '../../../../../../gateway/api/wallets';

export interface RewardCellProps {
  readonly farm: Farm;
}

enum RewardCellState {
  CONNECT_WALLET,
  ADD_LIQUIDITY,
  CREATE_STAKE,
  REWARD,
  FINISHED,
}

export const RewardCell: FC<RewardCellProps> = ({ farm }) => {
  const [isWalletConnected] = useObservable(isWalletSetuped$);
  const [rewardState, setRewardState] = useState<RewardCellState>(
    RewardCellState.REWARD,
  );

  useEffect(() => {
    if (!isWalletConnected) {
      setRewardState(RewardCellState.CONNECT_WALLET);
    } else if (farm.status === FarmStatus.Finished) {
      setRewardState(RewardCellState.FINISHED);
    } else if (
      !farm.availableToStakeLq.isPositive() &&
      !farm.yourStakeLq.isPositive()
    ) {
      setRewardState(RewardCellState.ADD_LIQUIDITY);
    } else if (!farm.yourStakeLq.isPositive()) {
      setRewardState(RewardCellState.CREATE_STAKE);
    } else {
      setRewardState(RewardCellState.REWARD);
    }
  }, [farm, isWalletConnected]);

  return (
    <Box
      width="100%"
      height="100%"
      transparent
      bordered={false}
      padding={[0, 4]}
    >
      <Flex col justify="center" stretch>
        <Typography.Body secondary size="small">
          <Trans>Next reward</Trans>
        </Typography.Body>
        <Typography.Body strong>
          {rewardState === RewardCellState.CONNECT_WALLET && (
            <Trans>Connect wallet to see your next rewards</Trans>
          )}
          {rewardState === RewardCellState.ADD_LIQUIDITY && (
            <>
              <Trans>
                Provide liquidity to the {farm.ammPool.x.asset.ticker}/
                {farm.ammPool.y.asset.ticker} and earn
              </Trans>{' '}
              <AssetIcon
                style={{ position: 'relative', top: 2 }}
                asset={farm.reward.asset}
                size="extraSmall"
                inline
              />{' '}
              {farm.reward.asset.ticker} <Trans>reward</Trans>
            </>
          )}
          {rewardState === RewardCellState.CREATE_STAKE && (
            <>
              <Trans>Stake</Trans> {farm.totalStakedX.asset.ticker}/
              {farm.totalStakedY.asset.ticker} and earn{' '}
              <AssetIcon
                style={{ position: 'relative', top: 2 }}
                asset={farm.reward.asset}
                size="extraSmall"
                inline
              />{' '}
              {farm.reward.asset.ticker} <Trans>reward</Trans>
            </>
          )}
          {rewardState === RewardCellState.FINISHED && <Trans>Finished</Trans>}
          {rewardState === RewardCellState.REWARD && farm.nextReward && (
            <Flex align="center">
              <Flex.Item marginRight={1}>
                <AssetIcon asset={farm.nextReward?.asset} size="extraSmall" />
              </Flex.Item>
              <Typography.Body strong>
                {farm.nextReward?.toCurrencyString()} (
                {<ConvenientAssetView value={farm.nextReward} />})
              </Typography.Body>
            </Flex>
          )}
        </Typography.Body>
      </Flex>
    </Box>
  );
};
