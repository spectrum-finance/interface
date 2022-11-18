import { Button, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { ClaimSpfReward } from '../../../../../../../network/ergo/api/claimSpf/claimSpfReward';
import { ReactComponent as SpfTokenIcon } from '../../spf-token.svg';

export interface GotRewardStateProps {
  readonly reward: ClaimSpfReward;
  readonly close: () => void;
}

export const GotRewardState: FC<GotRewardStateProps> = ({ reward, close }) => (
  <Flex col align="center">
    <Flex.Item marginTop={10} marginBottom={10}>
      <SpfTokenIcon />
    </Flex.Item>
    <Flex.Item marginBottom={2}>
      <Typography.Body size="large">
        <Trans>You got it!</Trans>
      </Typography.Body>
    </Flex.Item>
    <Flex.Item marginBottom={8}>
      <Typography.Title
        level={1}
        style={{ color: 'var(--spectrum-primary-color)' }}
      >
        {reward.total.toCurrencyString()}
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
