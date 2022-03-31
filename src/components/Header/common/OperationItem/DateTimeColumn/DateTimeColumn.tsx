import { DateTime } from 'luxon';
import React, { FC } from 'react';

import { Flex } from '../../../../../ergodex-cdk';
import { DateTimeView } from '../../../../common/DateTimeView/DateTimeView';

export interface DateTimeViewProps {
  readonly dateTime: DateTime;
}

export const DateTimeColumn: FC<DateTimeViewProps> = ({ dateTime }) => (
  <Flex col>
    <Flex.Item marginBottom={1}>
      <DateTimeView type="date" value={dateTime} />
    </Flex.Item>
    <Flex.Item>
      <DateTimeView type="time" value={dateTime} />
    </Flex.Item>
  </Flex>
);
