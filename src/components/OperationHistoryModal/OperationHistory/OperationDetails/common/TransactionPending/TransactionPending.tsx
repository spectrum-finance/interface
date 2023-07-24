import { Flex, Spin, Typography } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import { FC, ReactNode } from 'react';

export interface TransactionRefundProps {
  readonly title: ReactNode | ReactNode[] | string;
}

export const TransactionPending: FC<TransactionRefundProps> = ({ title }) => (
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
        <Trans>Please wait, your operation is currently pending.</Trans>
      </Typography.Body>
    </Flex.Item>
  </Flex>
);
