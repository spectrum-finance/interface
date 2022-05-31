import { DateTime } from 'luxon';
import React, { FC } from 'react';

import { Flex, Typography } from '../../../../../ergodex-cdk';
import { DateTimeView } from '../../../../common/DateTimeView/DateTimeView';

export interface DateTimeViewProps {
  readonly dateTime: DateTime;
}

export const DateTimeColumn: FC<DateTimeViewProps> = ({ dateTime }) => (
  <Flex col>
    <Flex.Item marginBottom={1}>
      <Typography.Body>
        <DateTimeView type="date" value={dateTime} />
      </Typography.Body>
    </Flex.Item>
    <Flex.Item>
      <Typography.Body>
        <DateTimeView type="time" value={dateTime} />
      </Typography.Body>
    </Flex.Item>
  </Flex>
);
