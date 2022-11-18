import { Button, Flex, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { ReactComponent as SpfTokenIcon } from '../../spf-token.svg';

export const NothingToClaimState: FC = () => (
  <Flex col align="center">
    <Flex.Item marginTop={10} marginBottom={10}>
      <SpfTokenIcon />
    </Flex.Item>
    <Flex.Item marginBottom={2}>
      <Typography.Title level={4}>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <Trans>Didn't get SPF?</Trans>
      </Typography.Title>
    </Flex.Item>
    <Flex.Item>
      <Typography.Body size="large" align="center">
        <Trans>
          Don’t worry. You still can earn it by providing liquidity and staking
          LP tokens in farms!
        </Trans>
      </Typography.Body>
    </Flex.Item>
    <Flex.Item marginBottom={6}>
      <Button type="link">
        <Trans>Read more about SPF</Trans>
      </Button>
    </Flex.Item>
    <Button size="extra-large" style={{ width: '100%' }} type="primary">
      <Trans>Add Liquidity</Trans>
    </Button>
  </Flex>
);
