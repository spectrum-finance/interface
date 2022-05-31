import { DateTime } from 'luxon';
import React, { FC } from 'react';

import { Flex } from '../../../../ergodex-cdk';
import { DateTimeView } from '../../../common/DateTimeView/DateTimeView';

export interface DateTimeCellProps {
  readonly dateTime: DateTime;
}

export const DateTimeCell: FC<DateTimeCellProps> = ({ dateTime }) => (
  <Flex col>
    <Flex.Item marginBottom={1}>
      <DateTimeView value={dateTime} />
    </Flex.Item>
    <DateTimeView type="time" value={dateTime} />
  </Flex>
);
