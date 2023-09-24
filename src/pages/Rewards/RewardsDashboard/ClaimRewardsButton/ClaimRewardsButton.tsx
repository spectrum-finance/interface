import { Button, Flex, Typography } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { DateTime, Interval } from 'luxon';
import { FC, useEffect, useState } from 'react';

import { useObservable } from '../../../../common/hooks/useObservable';
import {
  openConfirmationModal,
  Operation,
} from '../../../../components/ConfirmationModal/ConfirmationModal';
import {
  claimRewards,
  ClaimRewardsStatus,
  rewardsPaymentRequestStatus$,
} from '../../../../network/cardano/api/rewards/claimRewards';
import { RewardsData } from '../../../../network/cardano/api/rewards/rewards';

const CLAIMS_OPEN_DATETIME = DateTime.utc(2023, 9, 25, 21, 0);

export const ClaimRewardsButton: FC<{ rewardsData: RewardsData }> = ({
  rewardsData,
}) => {
  const [now, setNow] = useState(DateTime.now());
  const [rewardsPaymentRequestStatus] = useObservable(
    rewardsPaymentRequestStatus$,
  );
  const onHandleClaimRewards = () => {
    openConfirmationModal(claimRewards(rewardsData), Operation.CLAIM, {
      xAsset: rewardsData.totalAvailable,
    });
  };

  useEffect(() => {
    const intervalId = setInterval(() => setNow(DateTime.now()), 1_000);

    return () => clearInterval(intervalId);
  }, []);

  const isRewardClaimable = now.toUTC() >= CLAIMS_OPEN_DATETIME;
  const r = Interval.fromDateTimes(now, CLAIMS_OPEN_DATETIME).end.diff(
    now.toUTC(),
    ['days', 'hours', 'minutes', 'seconds', 'milliseconds'],
  );

  return (
    <Flex col align="center">
      <Flex.Item width="100%">
        <Button
          loading={
            rewardsPaymentRequestStatus !== ClaimRewardsStatus.AVAILABLE ||
            rewardsData.totalPending.isPositive()
          }
          disabled={!isRewardClaimable}
          size="extra-large"
          type="primary"
          block
          onClick={onHandleClaimRewards}
        >
          {rewardsPaymentRequestStatus === ClaimRewardsStatus.AVAILABLE &&
            !rewardsData.totalPending.isPositive() &&
            t`Claim rewards`}
          {rewardsPaymentRequestStatus === ClaimRewardsStatus.AVAILABLE &&
            rewardsData.totalPending.isPositive() &&
            t`Claiming ${rewardsData.totalPending.toCurrencyString()}`}
          {rewardsPaymentRequestStatus === ClaimRewardsStatus.IN_MEMPOOL &&
            t`Processing transaction`}
          {rewardsPaymentRequestStatus ===
            ClaimRewardsStatus.PAYMENT_HANDLING && t`Payment handling`}
          {rewardsPaymentRequestStatus === ClaimRewardsStatus.LOADING &&
            t`Loading`}
        </Button>
      </Flex.Item>
      {!isRewardClaimable && (
        <Flex.Item marginTop={2} display="flex" col align="center">
          <Typography.Body size="small" secondary>
            Claims will be opened on{' '}
            {`${CLAIMS_OPEN_DATETIME.toLocal().toFormat(
              "dd LLL yyyy 'at' HH:mm",
            )}`}{' '}
            in{' '}
          </Typography.Body>
          <Typography.Body size="small" secondary>
            in {`${r.days} days ${r.hours} hours ${r.minutes} minutes`}
          </Typography.Body>
        </Flex.Item>
      )}
    </Flex>
  );
};
