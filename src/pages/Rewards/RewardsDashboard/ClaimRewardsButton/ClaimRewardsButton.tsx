import { Button, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { DateTime, Interval } from 'luxon';
import { useEffect, useState } from 'react';

const CLAIMS_OPEN_DATETIME = DateTime.utc(2023, 9, 23, 12, 0);

export const ClaimRewardsButton = () => {
  const [now, setNow] = useState(DateTime.now());
  const onHandleClaimRewards = () => {
    /*TODO*/
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
          size="extra-large"
          type="primary"
          block
          disabled={!isRewardClaimable}
          onClick={onHandleClaimRewards}
        >
          <Trans>Claim Rewards</Trans>
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
