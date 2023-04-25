import { Button, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC } from 'react';

import { SpfReward } from '../../../../../../../network/ergo/api/spfFaucet/spfReward';
import { ReactComponent as SpfTokenIcon } from '../../spf-token.svg';

export interface GotRewardStateProps {
  readonly reward: SpfReward;
  readonly close: () => void;
}

export const AlreadyRewardState: FC<GotRewardStateProps> = ({
  reward,
  close,
}) => (
  <Flex col align="center">
    <Flex.Item marginTop={10} marginBottom={10}>
      <SpfTokenIcon />
    </Flex.Item>
    <Flex.Item marginBottom={2}>
      <Typography.Body size="large">
        <Trans>You claimed</Trans>
      </Typography.Body>
    </Flex.Item>
    <Flex.Item marginBottom={8}>
      <Typography.Title
        level={1}
        style={{ color: 'var(--spectrum-primary-color)' }}
      >
        {reward.claimed.toCurrencyString()}
      </Typography.Title>
    </Flex.Item>
    <Button
      onClick={close}
      size="extra-large"
      style={{ width: '100%' }}
      type="primary"
    >
      <Trans>Awesome</Trans>
    </Button>
  </Flex>
);
