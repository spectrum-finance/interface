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
          <Typography.Title level={5}>ERG balance is low</Typography.Title>
        </Flex.Item>
        <Flex.Item>
          <Typography.Body>
            You need ERG to pay transaction fees
          </Typography.Body>
        </Flex.Item>
        <Flex.Item>
          <Typography.Link
            href="https://docs.ergodex.io/docs/user-guides/quick-start#3-get-assets"
            target="_blank"
          >
            Learn how to get ERG
          </Typography.Link>
        </Flex.Item>
      </Flex>
    </Tag>
  );
};

export { LowBalanceWarning };
