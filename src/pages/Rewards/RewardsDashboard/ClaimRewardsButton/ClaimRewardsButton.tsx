import { Box, Button, Flex, Typography } from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { DateTime, Interval } from 'luxon';
import { FC, useEffect, useState } from 'react';

import { useObservable } from '../../../../common/hooks/useObservable';
import { AssetIcon } from '../../../../components/AssetIcon/AssetIcon';
import {
  openConfirmationModal,
  Operation,
} from '../../../../components/ConfirmationModal/ConfirmationModal';
import { InfoTooltip } from '../../../../components/InfoTooltip/InfoTooltip';
import {
  buildClaimTx,
  claimRewards,
  ClaimRewardsStatus,
  rewardsPaymentRequestStatus$,
} from '../../../../network/cardano/api/rewards/claimRewards';
import { RewardsData } from '../../../../network/cardano/api/rewards/rewards';

export const CLAIMS_OPEN_DATETIME = DateTime.utc(2023, 9, 29, 21, 0).toLocal();

export const ClaimRewardsButton: FC<{ rewardsData: RewardsData }> = ({
  rewardsData,
}) => {
  const [now, setNow] = useState(DateTime.now());
  const [rewardsPaymentRequestStatus] = useObservable(
    rewardsPaymentRequestStatus$,
  );
  const [validationData] = useObservable(buildClaimTx(rewardsData), [
    rewardsData,
  ]);
  const onHandleClaimRewards = () => {
    openConfirmationModal(claimRewards(rewardsData), Operation.CLAIM, {
      xAsset: rewardsData.totalAvailable,
    });
  };

  useEffect(() => {
    const intervalId = setInterval(() => setNow(DateTime.now()), 1_000);

    return () => clearInterval(intervalId);
  }, []);

  const isRewardClaimable = now.toUTC().toLocal() >= CLAIMS_OPEN_DATETIME;
  const r = Interval.fromDateTimes(now, CLAIMS_OPEN_DATETIME).end.diff(
    now.toUTC(),
    ['days', 'hours', 'minutes', 'seconds', 'milliseconds'],
  );

  return (
    <Flex col align="center">
      {validationData && (
        <Flex.Item marginBottom={4} width="100%">
          <Box padding={3} borderRadius="l" bordered width="100%">
            <Flex justify="space-between" align="center">
              <Typography.Title level={5}>
                <InfoTooltip
                  width={300}
                  isQuestionIcon
                  content={
                    <Trans>
                      To create and send a transaction with rewards we need{' '}
                      {validationData.requiredAda.toString()} ADA. All ADA will
                      be returned to you, except for ~0.4 ADA, which the
                      blockchain will charge for execution (also known as gas
                      fee).
                    </Trans>
                  }
                >
                  <Trans>Refundable ADA Deposit</Trans>
                </InfoTooltip>
              </Typography.Title>
              <Flex.Item display="flex" align="center">
                <Flex.Item marginRight={1}>
                  <AssetIcon
                    asset={validationData.requiredAda.asset}
                    size="small"
                  />
                </Flex.Item>
                <Typography.Body size="large" strong>
                  {validationData.requiredAda.toCurrencyString()}
                </Typography.Body>
              </Flex.Item>
            </Flex>
          </Box>
        </Flex.Item>
      )}
      <Flex.Item width="100%">
        <Button
          loading={
            rewardsPaymentRequestStatus !== ClaimRewardsStatus.AVAILABLE ||
            rewardsData.totalPending.isPositive() ||
            !validationData
          }
          disabled={
            !isRewardClaimable ||
            (!validationData?.transaction &&
              rewardsPaymentRequestStatus === ClaimRewardsStatus.AVAILABLE &&
              !rewardsData.totalPending.isPositive())
          }
          size="extra-large"
          type="primary"
          block
          onClick={onHandleClaimRewards}
        >
          {rewardsPaymentRequestStatus === ClaimRewardsStatus.AVAILABLE &&
            !rewardsData.totalPending.isPositive() &&
            !validationData?.transaction &&
            !!validationData &&
            !!validationData.addresses.length &&
            t`Insufficient Ada For Claiming`}
          {rewardsPaymentRequestStatus === ClaimRewardsStatus.AVAILABLE &&
            !rewardsData.totalPending.isPositive() &&
            !validationData?.transaction &&
            !!validationData &&
            !validationData.addresses.length &&
            t`No available rewards`}
          {rewardsPaymentRequestStatus === ClaimRewardsStatus.AVAILABLE &&
            !rewardsData.totalPending.isPositive() &&
            !!validationData?.transaction &&
            !!validationData &&
            t`Claim rewards`}
          {rewardsPaymentRequestStatus === ClaimRewardsStatus.AVAILABLE &&
            rewardsData.totalPending.isPositive() &&
            t`Claiming ${rewardsData.totalPending.toCurrencyString()}`}
          {rewardsPaymentRequestStatus === ClaimRewardsStatus.IN_MEMPOOL &&
            t`Processing transaction`}
          {rewardsPaymentRequestStatus ===
            ClaimRewardsStatus.PAYMENT_HANDLING && t`Payment handling`}
          {(rewardsPaymentRequestStatus === ClaimRewardsStatus.LOADING ||
            !validationData) &&
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
