import { DateTime } from 'luxon';

export const getFormattedDateTime = (timestamp: bigint): string =>
  DateTime.fromMillis(Number(timestamp)).toLocaleString(DateTime.DATETIME_MED, {
    locale: 'en',
  });

export const getFormattedDate = (timestamp: bigint): string =>
  DateTime.fromMillis(Number(timestamp)).toLocaleString(DateTime.DATE_FULL, {
    locale: 'en',
  });

export const getFormattedTime = (timestamp: bigint): string =>
  DateTime.fromMillis(Number(timestamp)).toLocaleString(DateTime.TIME_SIMPLE, {
    locale: 'en',
  });
