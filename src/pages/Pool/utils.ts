import { DateTime } from 'luxon';

export const getLockingPeriodString = (date: DateTime): string => {
  const duration = date
    .endOf('day')
    .diffNow(['days', 'years', 'months', 'hours']);
  const yearsCount = duration.get('year');
  const monthsCount = duration.get('month');
  const daysCount = duration.get('day');

  const years = yearsCount === 1 ? `1 Year` : `${yearsCount} Years`;
  const months = monthsCount === 1 ? `1 Month` : `${monthsCount} Months`;
  const days = daysCount === 1 ? `1 Day` : `${daysCount} Days`;

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

export const getLockStatus = (deadline: DateTime): 'Locked' | 'Unlocked' => {
  if (deadline < DateTime.now()) {
    return 'Locked';
  }
  return 'Unlocked';
};
