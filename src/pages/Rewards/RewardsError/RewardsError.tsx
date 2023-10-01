import {
  Button,
  CloseCircleOutlined,
  Flex,
  ReloadOutlined,
  Typography,
} from '@ergolabs/ui-kit';
import { t, Trans } from '@lingui/macro';
import { FC } from 'react';

import { SPECTRUM_DISCORD_LINK } from '../../../common/constants/url';
import { updateRewards$ } from '../../../network/cardano/api/rewards/rewards';

export const RewardsError: FC = () => {
  return (
    <Flex col align="center">
      <Flex.Item marginBottom={4}>
        <CloseCircleOutlined
          style={{ fontSize: 120, color: 'var(--spectrum-primary-color)' }}
        />
      </Flex.Item>
      <Flex.Item>
        <Typography.Title level={3}>
          <Trans>Failed to load rewards</Trans>
        </Typography.Title>
      </Flex.Item>
      <Flex.Item marginBottom={2}>
        <Typography.Body>
          <Trans>Try again or</Trans>
        </Typography.Body>{' '}
        <Button
          type="link"
          style={{ padding: 0 }}
          target="_blank"
          href={SPECTRUM_DISCORD_LINK}
        >
          <Trans>contact support</Trans>
        </Button>
      </Flex.Item>
      <Button
        type="primary"
        size="large"
        onClick={() => updateRewards$.next(undefined)}
        icon={<ReloadOutlined />}
      >
        {t`Retry`}
      </Button>
    </Flex>
  );
};
