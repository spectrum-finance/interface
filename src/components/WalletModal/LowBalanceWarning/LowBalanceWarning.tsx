import { Trans } from '@lingui/macro';
import React from 'react';

import { Flex, Tag, Typography } from '../../../ergodex-cdk';

const LowBalanceWarning = (): JSX.Element => {
  return (
    <Tag
      style={{
        width: '100%',
        padding: 'calc(var(--ergo-base-gutter) * 4)',
      }}
      color="warning"
    >
      <Flex direction="col">
        <Flex.Item marginBottom={2}>
          <Typography.Title level={5}>
            <Trans>ERG balance is low</Trans>
          </Typography.Title>
        </Flex.Item>
        <Flex.Item>
          <Typography.Body>
            <Trans>You need ERG to pay transaction fees</Trans>
          </Typography.Body>
        </Flex.Item>
        <Flex.Item>
          <Typography.Link
            href="https://docs.ergodex.io/docs/user-guides/quick-start#3-get-assets"
            target="_blank"
          >
            <Trans>Learn how to get ERG</Trans>
          </Typography.Link>
        </Flex.Item>
      </Flex>
    </Tag>
  );
};

export { LowBalanceWarning };
