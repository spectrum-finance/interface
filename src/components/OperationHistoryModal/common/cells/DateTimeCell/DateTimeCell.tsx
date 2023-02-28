import { Flex, Typography } from '@ergolabs/ui-kit';
import { DateTime } from 'luxon';
import React, { FC } from 'react';

import { DateTimeView } from '../../../../common/DateTimeView/DateTimeView';

export interface DateTimeCellProps {
  readonly dateTime?: DateTime;
  readonly short?: boolean;
}

export const DateTimeCell: FC<DateTimeCellProps> = ({ dateTime, short }) => (
  <Typography.Body size="small">
    {short ? (
      <>
        {dateTime?.toFormat('dd MMM, yy')}{' '}
        <Typography.Body secondary size="small">
          {dateTime?.toFormat('HH:MM')}
        </Typography.Body>
      </>
    ) : (
      <Flex col>
        <Flex.Item marginBottom={1}>
          <DateTimeView value={dateTime} />
        </Flex.Item>
        <DateTimeView type="time" value={dateTime} />
      </Flex>
    )}
  </Typography.Body>
);
