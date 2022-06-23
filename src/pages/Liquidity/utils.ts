import { MinBoxValue } from '@ergolabs/ergo-sdk';
import { t } from '@lingui/macro';
import { DateTime } from 'luxon';

export const getLockingPeriodString = (date: DateTime): string => {
  const duration = date
    .endOf('day')
    .diffNow(['days', 'years', 'months', 'hours']);
  const yearsCount = duration.get('year');
  const monthsCount = duration.get('month');
  const daysCount = duration.get('day');

  const years = yearsCount === 1 ? t`1 Year` : t`${yearsCount} Years`;
  const months = monthsCount === 1 ? t`1 Month` : t`${monthsCount} Months`;
  const days = daysCount === 1 ? t`1 Day` : t`${daysCount} Days`;

  if (yearsCount && monthsCount && daysCount) {
    return `${years}, ${months} and ${days}`;
  }

  if (yearsCount && monthsCount && !daysCount) {
    return `${years}, ${months}`;
  }

  if (yearsCount && !monthsCount && daysCount) {
    return `${years}, ${days}`;
  }

  if (!yearsCount && monthsCount && daysCount) {
    return `${months}, ${days}`;
  }

  if (yearsCount && !monthsCount && !daysCount) {
    return `${years}`;
  }

  if (!yearsCount && monthsCount && !daysCount) {
    return `${months}`;
  }

  return days;
};

export const getFeeForLockTarget = (minerFeeNErgs: bigint): bigint =>
  MinBoxValue + minerFeeNErgs * 2n;
