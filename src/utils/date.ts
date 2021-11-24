import { DateTime } from 'luxon';

export const getFormattedDate = (date: bigint): string =>
  DateTime.fromMillis(Number(date)).toLocaleString(DateTime.DATETIME_MED);
