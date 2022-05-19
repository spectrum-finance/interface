import { DateTime, DurationLike } from 'luxon';

export type Period = 'D' | 'W' | 'M' | 'Y' | string;

export interface PeriodSetting {
  resolution: number;
  durationOffset: DurationLike;
  timeFormat: Intl.DateTimeFormatOptions;
}

const PeriodSettings: Record<Period, PeriodSetting> = {
  D: {
    resolution: 10,
    durationOffset: { day: 1 },
    timeFormat: DateTime.TIME_SIMPLE,
  },
  W: {
    resolution: 10,
    durationOffset: { week: 1 },
    timeFormat: {
      month: 'long',
      day: 'numeric',
    },
  },
  M: {
    resolution: 10,
    durationOffset: { month: 1 },
    timeFormat: {
      month: 'long',
      day: 'numeric',
    },
  },
  Y: {
    resolution: 10,
    durationOffset: { year: 1 },
    timeFormat: {
      month: 'long',
      day: 'numeric',
    },
  },
};
export const usePeriodSettings = (period: Period): PeriodSetting => {
  return PeriodSettings[period];
};
