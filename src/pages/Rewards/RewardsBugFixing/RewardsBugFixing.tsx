import {
  BugOutlined,
  Button,
  Divider,
  Flex,
  Typography,
} from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { DateTime, Interval } from 'luxon';
import { FC, useEffect, useState } from 'react';

import { SPECTRUM_DISCORD_LINK } from '../../../common/constants/url';
import { CLAIMS_OPEN_DATETIME } from '../RewardsDashboard/ClaimRewardsButton/ClaimRewardsButton';

export const RewardsBugFixing: FC = () => {
  const [now, setNow] = useState(DateTime.now());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(DateTime.now()), 1_000);

    return () => clearInterval(intervalId);
  }, []);

  const r = Interval.fromDateTimes(now, CLAIMS_OPEN_DATETIME).end.diff(
    now.toUTC(),
    ['days', 'hours', 'minutes', 'seconds', 'milliseconds'],
  );

  return (
    <Flex col align="center">
      <Flex.Item marginBottom={4}>
        <BugOutlined
          style={{ fontSize: 110, color: 'var(--spectrum-primary-text)' }}
        />
      </Flex.Item>
      <Flex.Item marginBottom={4}>
        <Typography.Title level={1}>
          <Trans>Fixing bugs</Trans>
        </Typography.Title>
      </Flex.Item>
      <Flex.Item marginBottom={4} width="100%">
        <Divider type="horizontal" />
      </Flex.Item>
      <Flex.Item>
        <Typography.Body size="small" secondary>
          Claims will be opened in{' '}
          {`${r.days} days ${r.hours} hours ${r.minutes} minutes`}
        </Typography.Body>
      </Flex.Item>
      <Flex.Item>
        <Typography.Body size="small" secondary>
          Need help? Join{' '}
          <Button
            style={{ padding: 0 }}
            href={SPECTRUM_DISCORD_LINK}
            target="_blank"
            type="link"
          >
            Discord
          </Button>
        </Typography.Body>
      </Flex.Item>
    </Flex>
  );
};
