import { Flex, Typography } from '@ergolabs/ui-kit';
import { t } from '@lingui/macro';
import { DateTime } from 'luxon';
import React, { FC, ReactNode } from 'react';

import { CopyButton } from '../../../../../common/CopyButton/CopyButton';
import { ExploreButton } from '../../../../../common/ExploreButton/ExploreButton';

export interface TransactionDetailProps {
  readonly title: ReactNode | ReactNode[] | string;
  readonly dateTime: DateTime;
  readonly content: ReactNode | ReactNode[] | string;
  readonly transactionId: string;
}

export const TransactionDetails: FC<TransactionDetailProps> = ({
  title,
  dateTime,
  content,
  transactionId,
}) => {
  return (
    <Flex col width="100%" stretch>
      <Flex.Item
        marginBottom={2}
        width="100%"
        display="flex"
        align="center"
        justify="space-between"
      >
        <Flex.Item>
          <Typography.Body strong secondary>
            {title}
          </Typography.Body>
        </Flex.Item>
        <Flex.Item>
          <Typography.Body strong>
            {dateTime.toFormat('dd MMM, yy')}{' '}
          </Typography.Body>
          <Typography.Body strong secondary>
            {dateTime.toFormat('HH:mm')}
          </Typography.Body>
        </Flex.Item>
      </Flex.Item>
      <Flex.Item flex={1} display="flex" align="center" justify="space-between">
        <Flex.Item minWidth={188}>{content}</Flex.Item>
        <Flex.Item display="flex">
          <Flex.Item marginRight={2}>
            <ExploreButton to={transactionId} size="middle" />
          </Flex.Item>
          <CopyButton
            messageContent={t`TxId successfully copied`}
            text={transactionId}
            size="middle"
          />
        </Flex.Item>
      </Flex.Item>
    </Flex>
  );
};
