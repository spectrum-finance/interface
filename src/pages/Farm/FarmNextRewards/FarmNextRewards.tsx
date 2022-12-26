import React from 'react';

import { Farm } from '../../../common/models/Farm';

type Props = {
  lmPool: Farm;
};

export const FarmNextRewards = ({ lmPool }: Props) => {
  // const [networkContext] = useObservable(networkContext$);
  //
  // if (lmPool.status === LmPoolStatus.Scheduled) {
  //   <Flex direction="col">
  //     <Typography.Body secondary>
  //       <Trans>Next distribution rewards</Trans>
  //     </Typography.Body>
  //     <Typography.Body>
  //       You will be able to see next rewards starting from
  //       {blockToDateTime(
  //         lmPool.currentHeight,
  //         lmPool.config.programStart,
  //       ).toFormat('yyyy-MM-dd')}
  //     </Typography.Body>
  //   </Flex>;
  // }
  //
  // if (lmPool.currentStatus === FarmState.Finished) {
  //   return (
  //     <Flex direction="col">
  //       <Typography.Body secondary>
  //         <Trans>Next distribution rewards</Trans>
  //       </Typography.Body>
  //       <Typography.Body>The farm is finished</Typography.Body>
  //     </Flex>
  //   );
  // }
  //
  // if (!lmPool.balanceLq.isPositive()) {
  //   return (
  //     <Flex direction="col">
  //       <Typography.Body secondary>
  //         <Trans>Next distribution rewards</Trans>
  //       </Typography.Body>
  //       <Typography.Body>
  //         Provide liquidity and earn rewards in {lmPool.reward.asset.ticker}
  //       </Typography.Body>
  //     </Flex>
  //   );
  // }
  //
  // if (!lmPool.balanceVlq.isPositive()) {
  //   return (
  //     <Flex direction="col">
  //       <Typography.Body secondary>
  //         <Trans>Next distribution rewards</Trans>
  //       </Typography.Body>
  //       <Typography.Body>
  //         Stake {lmPool.ammPool.x.asset.ticker}/{lmPool.ammPool.y.asset.ticker}{' '}
  //         and earn rewards in {lmPool.reward.asset.ticker}
  //       </Typography.Body>
  //     </Flex>
  //   );
  // }
  //
  // if (networkContext?.height && lmPool.currentStatus === FarmState.Live) {
  //   const interestsRelation = numeral(5000).divide(10000);
  //   const rewardAmountEachEpoch = numeral(500000).divide(8);
  //   const nextRewardsDistribution = rewardAmountEachEpoch
  //     .multiply(interestsRelation.value())
  //     .value();
  //
  //   return (
  //     <Flex direction="col">
  //       <Typography.Body secondary>
  //         <Trans>Next distribution rewards</Trans>
  //       </Typography.Body>
  //       <Typography.Body>{nextRewardsDistribution}</Typography.Body>
  //     </Flex>
  //   );
  // }

  return null;
};
