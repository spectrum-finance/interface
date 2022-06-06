import { DateTime, DurationLike } from 'luxon';

export type Period = 'D' | 'W' | 'M' | 'Y' | string;

export interface PeriodSetting {
  resolution: number;
  durationOffset: DurationLike;
  tick: DurationLike;
  timeFormat: Intl.DateTimeFormatOptions;
}

const PeriodSettings: Record<Period, PeriodSetting> = {
  D: {
    resolution: 1,
    durationOffset: { day: 1 },
    tick: { hour: 1 },
    timeFormat: DateTime.TIME_SIMPLE,
  },
  W: {
    resolution: 1,
    durationOffset: { week: 1 },
    tick: { hour: 6 },
    timeFormat: {
      month: 'long',
      day: 'numeric',
    },
  },
  M: {
    resolution: 1,
    durationOffset: { month: 1 },
    tick: { day: 1 },
    timeFormat: {
      month: 'long',
      day: 'numeric',
    },
  },
  Y: {
    resolution: 1,
    durationOffset: { year: 1 },
    tick: { day: 15 },
    timeFormat: {
      month: 'long',
      day: 'numeric',
    },
  },
};
export const usePeriodSettings = (period: Period): PeriodSetting => {
  return PeriodSettings[period];
};
