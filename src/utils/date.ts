import { DateTime } from 'luxon';

export const getFormattedDate = (timestamp?: bigint): string =>
  timestamp
    ? DateTime.fromMillis(Number(timestamp)).toLocaleString(
        DateTime.DATETIME_MED,
        { locale: 'en' },
      )
    : '';
