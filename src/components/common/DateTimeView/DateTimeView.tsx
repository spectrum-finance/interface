import { DateTime } from 'luxon';
import React from 'react';

import { Typography } from '../../../ergodex-cdk';

interface DateTimeViewProps {
  type?: 'date' | 'time' | 'datetime';
  value: DateTime;
}

const DateTimeView: React.FC<DateTimeViewProps> = ({ type, value }) => {
  const getDate = () => {
    if (type === 'time') return value.toLocaleString(DateTime.TIME_SIMPLE);
    if (type === 'datetime') return value.toLocaleString(DateTime.DATETIME_MED);
    return value.toLocaleString(DateTime.DATE_FULL);
  };
  return <Typography.Body>{getDate()}</Typography.Body>;
};

export { DateTimeView };
