import { Flex, Spin, Typography } from '@ergolabs/ui-kit';
import React, { FC, ReactNode } from 'react';

export interface TransactionRefundProps {
  readonly title: ReactNode | ReactNode[] | string;
}

export const TransactionRefund: FC<TransactionRefundProps> = ({ title }) => (
  <Flex col width="100%" stretch>
    <Flex.Item marginBottom={2}>
      <Typography.Body strong secondary>
        {title}
      </Typography.Body>
    </Flex.Item>
    <Flex.Item flex={1} display="flex" align="center" justify="center" col>
      <Flex.Item marginBottom={2}>
        <Spin style={{ color: 'var(--spectrum-secondary-text)' }} />
      </Flex.Item>
      <Typography.Body size="small" secondary>
        Please wait, your operation is currently pending.
      </Typography.Body>
    </Flex.Item>
  </Flex>
);
